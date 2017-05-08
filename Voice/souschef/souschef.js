/**
 Proj 03 Recipie App
 Built off of Sumukh's Proj02 and the APACHE 2 Licensed Starter/Example
 Citations:
 Started off of Amazon.com's APACHE 2 Licensed Starter/Example
 https://github.com/amzn/alexa-skills-kit-js/tree/deprecated/samples/reindeerGames
 */

'use strict';

var https = require('https');
var querystring = require('querystring');

var BASE_URL = 'https://ddx0dwb6p8.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Recipes'
var FLASK_APP = 'api.statushawk.com'

function getRequest(url, callback) {
    https.get(url, function(res) {
        res.on('data', function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.log("Error: ", e);
                callback(false, "Invalid response from the flask app. " + data)
            }
            callback(true, data);
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(false, e)
    });
}

function getFinalRecipe(cb) {
    getRequest("https://"+FLASK_APP + "/final_recipe", function (success, data) {
        if (success) {
            cb(data)
        } else {
            console.log("ERROR", data);
            cb(data);
        }
    })
}

function chooseRecipeId(id, cb) {
    getRequest("https://"+FLASK_APP + "/choose/"+id, function (success, data) {
        if (success) {
            cb(data)
        } else {
            console.log("ERROR", data);
            cb(data);
        }
    })
}


function getFilters(cb) {
    getRequest("https://"+FLASK_APP + "/filters", function (success, data) {
        if (success) {
            cb(JSON.parse(data))
        } else {
            cb(data);
        }
    })
}

function resetFlaskApp(cb) {
    getRequest("https://"+FLASK_APP + "/reset", function (success, data) {
        if (cb) {
            cb(success);
        }
    })
}

function postToFlask(data, cb, errorCB) {
        (function(callback) {
            'use strict';

            const httpTransport = require('https');
            const responseEncoding = 'utf8';

            const bodyData = JSON.stringify(data);
            const httpOptions = {
                hostname: FLASK_APP,
                port: '443',
                path: '/recipes',
                method: 'POST',
                headers: {"Content-Type":"application/json",
                          "Content-Length": bodyData.length}
            };
            httpOptions.headers['User-Agent'] = 'node ' + process.version;

            // Paw Store Cookies option is not supported

            const request = httpTransport.request(httpOptions, (res) => {
                let responseBufs = [];
                let responseStr = '';

                res.on('data', (chunk) => {
                    if (Buffer.isBuffer(chunk)) {
                        responseBufs.push(chunk);
                    }
                    else {
                        responseStr = responseStr + chunk;
                    }
                }).on('end', () => {
                    responseStr = responseBufs.length > 0 ?
                        Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;

                    callback(null, res.statusCode, res.headers, responseStr);
                });

            })
            .setTimeout(0)
            .on('error', (error) => {
                callback(error);
            });
            request.end(bodyData);


        })((error, statusCode, headers, body) => {
        console.log('ERROR:', error);
        console.log('STATUS:', statusCode);
        console.log('HEADERS:', JSON.stringify(headers));
        var resp = {}
        if (error) {
            console.log("ERROROR")
            // errorCB(error);
            cb(body);
        } else {
            try {
                resp = JSON.parse(body);
                console.log('BODY Parsed:', body);
            } catch (err) {
                console.log('BODY ERROR:', body);

                errorCB("Not a valid response. Try again");
                return;
            }
            cb(resp)
        }
    });

}


// function makeSpoonSearch(data, cb) {
//     (function(callback) {
//         'use strict';

//         const httpTransport = https;
//         const responseEncoding = 'utf8';
//         const httpOptions = {
//             hostname: 'spoonacular-recipe-food-nutrition-v1.p.mashape.com',
//             port: '443',
//             path: '/recipes/searchComplex?addRecipeInformation=true&cuisine=american&fillIngredients=true&includeIngredients=bagel&limitLicense=false&offset=0&ranking=2&type=breakfast',
//             method: 'GET',
//             headers: {"X-Mashape-Key":"","Accept":"application/json"}
//         };
//         httpOptions.headers['User-Agent'] = 'node ' + process.version;

//         // Paw Follow Redirects option is not supported
//         // Paw Store Cookies option is not supported

//         const request = httpTransport.request(httpOptions, (res) => {
//             let responseBufs = [];
//             let responseStr = '';

//             res.on('data', (chunk) => {
//                 if (Buffer.isBuffer(chunk)) {
//                     responseBufs.push(chunk);
//                 }
//                 else {
//                     responseStr = responseStr + chunk;
//                 }
//             }).on('end', () => {
//                 responseStr = responseBufs.length > 0 ?
//                     Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;

//                 callback(null, res.statusCode, res.headers, responseStr);
//             });

//         })
//         .setTimeout(0)
//         .on('error', (error) => {
//             callback(error);
//         });
//         request.write("")
//         request.end();


//     })((error, statusCode, headers, body) => {
//     console.log('ERROR:', error);
//     console.log('STATUS:', statusCode);
//     console.log('HEADERS:', JSON.stringify(headers));
//     cb(body)
//     console.log('BODY:', body);
// });
// }

function genFilters(attributes) {
    // {
    //     "cuisine": [ "african", "chinese", "japanese", "korean", "vietnamese", "thai", "indian", "british", "irish", "french", "italian", "mexican", "spanish", "middle eastern", "jewish", "american", "cajun", "southern", "greek", "german", "nordic", "eastern european", "caribbean", "latin american", "" ],
    //     "diet": ["pescetarian", "lacto vegetarian", "ovo vegetarian", "vegan", "paleo", "primal", "vegetarian", "" ],
    //     "excludeIngredients": [ "" ],
    //     "includeIngredients": [ "" ],
    //     "intolerances": ["dairy", "egg", "gluten", "peanut", "sesame", "seafood", "shellfish", "soy", "sulfite", "tree nut", "wheat", "" ],
    //     "type": ["main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "drink", "" ],
    // }
    var filters = {}
    if (attributes.cuisine) {
        filters.cuisine = attributes.cuisine.toLowerCase() ;
    }
    if (attributes.excludeIngredients) {
        filters.excludeIngredients = attributes.excludeIngredients;
    }
    if (attributes.includeIngredients) {
        filters.includeIngredients = attributes.includeIngredients;
    }
    // if (intolerances) {
    //     filters.intolerances = intolerances;
    // }
    if (attributes.meal) {
        filters.type = attributes.meal.toLowerCase();
    }
    return filters
}

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    /**
     * Uncomment this if statement and populate with your skill's application ID to
     * prevent someone else from configuring a skill that sends requests to this function.
     */
    // Commented for dev.
    // if (event.session.application.applicationId !== "foobar") {
    //     context.fail("Invalid Application ID");
    // }
        console.log(event) // for debugging;

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            console.log("Got a launch request");
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    console.log("Dispatching", intentName);

    // dispatch custom intents to handlers here
    if ("IngredientList" === intentName) {
        getSpecifiedIngredients(intent, session, callback);
    } else if ("TimeConstraint" === intentName) {
        getTimeRestriction(intent, session, callback);
    } else if ("CuisineFilter" === intentName) {
        getCuisineType(intent, session, callback);
    } else if ("MealFilter" === intentName) {
        getMealType(intent, session, callback);
    } else if ("DietaryConstraint" === intentName) {
        getDietaryRestrictions(intent, session, callback);
    } else if ("RatingFilter" === intentName) {
        getRating(intent, session, callback);
    } else if ("SubmitRecipie" === intentName) {
        getRating(intent, session, callback); // todo change
    } else if ("ListRecipies" === intentName) {
        listRecipies(intent, session, callback);
    } else if ("StartReading" === intentName) {
                // todo change
        if (session.attributes && session.attributes.hasChosenRecipie) {
            session.attributes.inStepsMode = true;
            // read steps
            readSteps(intent, session, callback);
        }
        else if (session.attributes && !session.attributes.filterEntryMode) {
            // read recipies
            listRecipies(intent, session, callback);
        }
    } else if ("NoIntent" === intentName) {
        handleNo(intent, session, callback);
    } else if ("YesIntent" === intentName) {
        handleYes(intent, session, callback);
    } else if ("NextStep" === intentName) {
        nextStep(intent, session, callback);
    } else if ("LastStep" === intentName) {
        lastStep(intent, session, callback);
    } else if ("SubmitRecipe" === intentName) {
        handleWebChoice(intent, session, callback);
    } else if ("HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("StartOver" === intentName) {
       handleRestartActivity(intent, session, callback);
    } else if ("MainMenuIntent" === intentName) {
        getWelcomeResponse(callback);
    } else {
        getWelcomeResponse(callback);
    }
}

/**
 * Called when the user ends the session.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);
}

var CARD_TITLE = "Sous Chef";
function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var speechOutput = "Hello, this is Sous Chef. What ingredients do you have?";
    var repromptText = speechOutput;
    sessionAttributes.filterEntryMode = true;
    sessionAttributes.promptFor = 'ingredients';

    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
}

function doConfusedResponse(intent, session, callback) {
    var output = "Sorry I got confused. What kind of recipe can I help you with?";
        callback(session.attributes,
        buildSpeechletResponse(CARD_TITLE, output, output, false));
}

function getSpecifiedIngredients(intent, session, callback) {
    var queryIngredients = intent.slots.Ingredient.value;
    queryIngredients = queryIngredients.split(" ");
    console.log("Ingredients Query:", intent, queryIngredients);
    if (!session.attributes) {
        session.attributes = {};
    }
    session.attributes.includeIngredients = queryIngredients;
    var output = "While I'm searching, do you have any other preferences?"
                + " For example, you can tell me how much time you have" +
                " or what kind of cuisine you like";
    session.attributes.promptFor = 'time or cuisine';

    return callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));
}

function getTimeRestriction(intent, session, callback) {
    var queryTime = intent.slots.time.value;
    console.log("Time Query:", intent, queryTime);

    if (!session.attributes) {
        session.attributes = {};
    }
    session.attributes.timeConstraint = queryTime;
    var output = "Got it. I will look for recipes that take less than " + queryTime +
                 " minutes. " + "Do you have any other preferences? ";
    return callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));
}

function getCuisineType(intent, session, callback) {
    var queryCuisine = intent.slots.cuisine.value;
     console.log("Cuisine Query:", intent, queryCuisine);

    if (!session.attributes) {
        session.attributes = {};
    }
    if (queryCuisine) {
        session.attributes.cuisine = queryCuisine.toLowerCase();
    }
    var output = "Ok sounds good . " + "Do you have any other preferences? ";
    return callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));

}

function getMealType(intent, session, callback) {
    var queryMeal = intent.slots.meal.value;
    console.log("Meal Query:", intent, queryMeal);

    if (!session.attributes) {
        session.attributes = {};
    }
    session.attributes.meal = queryMeal.toLowerCase();
    var output = "Ok, I will look for " + queryMeal + "items. "
                + "Do you have any other preferences? ";

    return callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));

}

function getDietaryRestrictions(intent, session, callback) {
    var queryRestrictions = intent.slots.constraint.value;
    queryRestrictions = queryRestrictions.split(" ");
    console.log("Restriction Query:", intent, queryRestrictions);

    if (!session.attributes) {
        session.attributes = {};
    }
    session.attributes.excludeIngredients = queryRestrictions;
    var output = "I feel bad that you can't eat those things. I will keep" +
                 "that in mind. " + "Do you have any other preferences? ";
    return callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));

}

function getRating(intent, session, callback) {
    var queryRating = intent.slots.rating.value;
    console.log("Rating Query:", intent, queryRating);

    if (!session.attributes) {
        session.attributes = {};
    }
    session.attributes.rating = queryRating;
    var output = "I will find something that meets your high standards! "
                + "Do you have any other preferences?";
    return callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));

}
function readARecipie(intent, session, callback) {
    var index = session.attributes.foundRecipieInd;
    var currR = session.attributes.recipieNames[index];
    var currImage = session.attributes.recipieImages[index];

    session.attributes.isRecipieListing = true;
    var output = "Would you like to make " + currR + "?";
    if (index == 0) {
        output += " If you would like to skip this - say no or pass."
    }

    if (currImage) {
            callback(session.attributes,
     buildSpeechletResponse(currR, output, output, false, currImage));
    } else{
            callback(session.attributes,
     buildSpeechletResponse(CARD_TITLE, output, output, false));
    }

}

function readSteps(intent, session, callback) {
    var index = session.attributes.recipieStepIndex;

    // Get the recipie by id

    if (!session.attributes.chosenRecipie.analyzedInstructions) {
        var output = "Awkard. There are no instructions for this recipe. Try restarting!";
        return    callback(session.attributes,
             buildSpeechletResponse(CARD_TITLE, output, output, false));
    }
    var steps = session.attributes.chosenRecipie.analyzedInstructions[0].steps;
    if (index >= steps.length) {
        var output = "There are no more steps. Enjoy your meal!";
        return    callback(session.attributes,
             buildSpeechletResponse("All Done!", output, output, true));

    }
    // TODO - get the ingredients associated with this step
    var currStep = steps[index];

    var stepNum = currStep.number

    session.attributes.isStepListing = true;
    var output = "Step " + stepNum + " is " + currStep.step + " . Say next step when you are done";

            callback(session.attributes,
     buildSpeechletResponse("Step "+ currStep, output, output, false));

}


function handleNo(intent, session, callback) {
    var output = "";
    if(session.attributes.isRecipieListing) {
        // said no to a recipie;
        session.attributes.foundRecipieInd += 1;
        return readARecipie(intent, session, callback);
    } else {
        session.attributes.filterEntryMode = false;

        postToFlask(genFilters(session.attributes), function (data) {
            console.log("I found", data);
            session.attributes.spoonResponse = true;

            var image = null;
            var recipieNames = [];
            var recipieImages = [];
            var recipieIds = [];
            var allR = [];

            for (var i = 0; i < Math.min(50, data.results.length); i++) {
                var currR = data.results[i];
                if (!image && currR.image) {
                    image = currR.image;
                }
                recipieNames.push(currR.title);
                recipieImages.push(currR.image);
                recipieIds.push(currR.id);
            }


            session.attributes.recipieNames = recipieNames;
            session.attributes.recipieImages = recipieImages;
            session.attributes.recipieIds = recipieIds;

            session.attributes.foundRecipieInd = 0;
            session.attributes.chosenRecipie = null;

            var output = "I found " + Math.min(50, data.results.length) + " recipes. Check them out on statushawk.com - or ask me to start reading the recipe names.";

            callback(session.attributes, buildSpeechletResponse(CARD_TITLE, output, output, false));

        }, function (error) {
                var output = "There was an error - sorry. Do you have any other preferences or would you like to start over?";
                session.attributes.filterEntryMode = true;
                callback(session.attributes, buildSpeechletResponse(CARD_TITLE, output, output, false));

        })
    }
}


function listRecipies(intent, session, callback) {

    if (!session.attributes) {
        session.attributes = {};
        return doConfusedResponse(intent, session, callback);
    }

    return readARecipie(intent, session, callback);

}

function handleYes(intent, session, callback) {
    var output = "";

    if (session.attributes.isRecipieListing) {
        var index = session.attributes.foundRecipieInd;
        var rid = session.attributes.recipieIds[index];


        // TBD - get full thing from flask
        // session.attributes.chosenRecipie = session.attributes.foundRecipieObjs[index];
        chooseRecipeId(rid, function (data) {
            session.attributes.chosenRecipie = data;


            // TODO POST TO GUI
            var output = "Great. Let's get cooking. When you are ready to start with the instructions say start recipe!";

            // TODO. You'll also need some other ingredients ...

            session.attributes.inStepsMode = true;
            session.attributes.isRecipieListing = false;
            session.attributes.recipieStepIndex = 0;
            session.attributes.hasChosenRecipie = true;

            if (data.image) {
                    callback(session.attributes,
             buildSpeechletResponse(data.title, output, output, false, data.image));
            } else{
                    callback(session.attributes,
             buildSpeechletResponse(CARD_TITLE, output, output, false));
            }

        })
    } else {
        return doConfusedResponse(intent, session, callback);
    }

}


function handleWebChoice(intent, session, callback) {
    var output = "";

        // get full thing from flask
        // session.attributes.chosenRecipie = session.attributes.foundRecipieObjs[index];
        getFinalRecipe(function (data) {
            session.attributes.chosenRecipie = data;


            // TODO POST TO GUI
            var output = "Great. Let's get cooking. When you are ready to start with the instructions say start recipe!";

            // TODO. You'll also need some other ingredients ...

            session.attributes.inStepsMode = true;
            session.attributes.isRecipieListing = false;
            session.attributes.recipieStepIndex = 0;
            session.attributes.hasChosenRecipie = true;

            if (data.image) {
                    callback(session.attributes,
             buildSpeechletResponse(data.title, output, output, false, data.image));
            } else{
                    callback(session.attributes,
             buildSpeechletResponse(CARD_TITLE, output, output, false));
            }

        })

}



// function listIngredient(intent, session, callback) {
//     if (!session.attributes.currentIngredients) {
//         return doConfusedResponse(intent, session, callback);
//     }
//     if (session.attributes.ingredientIndex >= (session.attributes.currentIngredients.length)) {
//         var output = "There are no more ingredients. You can start the recipe by saying start";
//     } else {
//         var ingredient = session.attributes.currentIngredients[session.attributes.ingredientIndex];
//         var output = session.attributes.currentIngredients[session.attributes.ingredientIndex];
//         if (session.attributes.ingredientIndex === (session.attributes.currentIngredients.length -1)) {
//             output  += ". That's the last one - say start recipe when you have got " + ingredient + ".";
//         }
//     }
//     callback(session.attributes,
//         buildSpeechletResponse(CARD_TITLE, output, output, false));
// }

// function listStep(intent, session, callback) {
//     if (!session.attributes) {
//         session.attributes = {}
//     }

//     if (!session.attributes.currentDirections) {
//         return doConfusedResponse(intent, session, callback);
//     }
//     if (session.attributes.directionsIndex >= (session.attributes.currentDirections.length)) {
//         var output = "There are no more steps. You can return to the main menu by saying restart";
//     } else {
//         var stepNum = parseInt(session.attributes.directionsIndex) + 1
//         var output = "Step " + stepNum + ": "  + session.attributes.currentDirections[session.attributes.directionsIndex];
//     }
//     callback(session.attributes,
//         buildSpeechletResponse(CARD_TITLE, output, output, false));
// }

// function listSteps(intent, session, callback) {
//     if (!session.attributes) {
//         session.attributes = {}
//     }

//     session.attributes.directionsMode = true;
//     session.attributes.ingredientMode = false;
//     session.attributes.directionsIndex = 0;
//     listStep(intent, session, callback)
// }


function nextStep(intent, session, callback) {
    if (!session.attributes) {
        session.attributes = {}
    }

    if (session.attributes.inStepsMode) {
        session.attributes.recipieStepIndex += 1;
        readSteps(intent, session, callback)
    } else if (session.attributes.isRecipieListing) {
        session.attributes.foundRecipieInd += 1;
        readARecipe(intent, session, callback)
    } else {
        return doConfusedResponse(intent, session, callback);
    }
}

function lastStep(intent, session, callback) {
    if (!session.attributes) {
        session.attributes = {}
    }

    if (session.attributes.inStepsMode) {
        // session.attributes.recipieStepIndex += 1;
        readSteps(intent, session, callback)
    } else if (session.attributes.isRecipieListing) {
        // session.attributes.foundRecipieInd += 1;
        readARecipe(intent, session, callback)
    } else {
        return doConfusedResponse(intent, session, callback);
    }
}


// function lastStep(intent, session, callback) {
//     if (!session.attributes) {
//         session.attributes = {}
//     }

//     if (session.attributes.ingredientMode) {
//         session.attributes.ingredientIndex -= 1;
//         if (session.attributes.ingredientIndex < 0) {
//             // Clamp the value to 0
//             session.attributes.ingredientIndex = 0;
//         }
//         listIngredient(intent, session, callback);
//     } else if (session.attributes.directionsMode) {
//         session.attributes.directionsIndex -= 1;
//         if (session.attributes.directionsIndex < 0) {
//             // Clamp the value to 0
//             session.attributes.directionsIndex = 0;
//         }
//         listStep(intent, session, callback);
//     } else {
//         return doConfusedResponse(intent, session, callback);
//     }
// }

function quitIntent(intent, session, callback) {
    var output = "Ok. "
    if (!session.attributes) {
        session.attributes = {}
    }

    if (session.attributes.ingredientMode) {
        session.attributes.ingredientMode = false;
        return handleMainMenu(intent, session, callback);
    } else if (session.attributes.directionsMode) {
        session.attributes.directionsMode = false;
        return handleMainMenu(intent, session, callback);
    } else {
        return handleFinishSessionRequest(intent, session, callback);
    }
}


function handleMainMenu(intent, session, callback) {
    if (!session.attributes) {
        session.attributes = {}
    }

    session.attributes.ingredientMode = false;
    session.attributes.directionsMode = false;
    return getWelcomeResponse(callback);
}


function handleRestartActivity(intent, session, callback) {
    resetFlaskApp(function(cb) {
            callback(session.attributes,
        buildSpeechletResponse(CARD_TITLE, "OK. I've reset your filters", "We've cleared your filters", false));

    })
}

function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }
    var speechOutput = "";
    // TODO be context aware
    speechOutput = "You can filter by any of the following: "
            + "ingredients, time, rating, cuisine, and dietary restrictions";
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, speechOutput, false));
}

function handleFinishSessionRequest(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Bon appetit!", "Bye Bye", true));
}


// ------- Helper functions to build responses -------

function buildSSMLResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: output
        },
        shouldEndSession: shouldEndSession
    };
}

function toSSL(image) {
    if (image.indexOf('https') == -1) {
        return image.replace('http', 'https');
    }
    return image;
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession, image) {
    console.log("Image", image);
    var card;
    if (!image) {
        card = {
            type: "Simple",
            title: repromptText,
            content: output
        };
    } else {
        var imageURL = toSSL(image);
        card = {
            type: 'Standard',
            title: title,
            text: output,
            image: {
              smallImageUrl: imageURL,
              largeImageUrl: imageURL
            }
        };
    }
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: card,
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
