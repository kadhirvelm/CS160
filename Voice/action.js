/**
 Proj 03 Recipie App

 Built off of Sumukh's Proj02 and the APACHE 2 Licensed Starter/Example

 Citations:
 Started off of Amazon.com's APACHE 2 Licensed Starter/Example
 https://github.com/amzn/alexa-skills-kit-js/tree/deprecated/samples/reindeerGames
 */

'use strict';

var https = require('https');
var BASE_URL = 'https://ddx0dwb6p8.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Recipes'

function getRequest(url, callback) {
    https.get(url, function(res) {
        res.on('data', function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.log("Error: ", e);
                callback(false, "Invalid response from the database. " + data)
            }
            callback(true, data);
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(false, e)
    });
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
    if ("DesiredFood" === intentName) {
        findFoodRecipe(intent, session, callback);
    } else if ("WhatCanISay" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("IngredientsQuery" === intentName) {
        listIngredients(intent, session, callback);
    } else if ("StartReading" === intentName) {
        listSteps(intent, session, callback);
    } else if ("QuitIntent" === intentName) {
        quitIntent(intent, session, callback);
    } else if ("MainMenuIntent" === intentName) {
        handleMainMenu(intent, session, callback);
    } else if ("NextStep" === intentName) {
        nextStep(intent, session, callback);
    } else if ("LastStep" === intentName) {
        lastStep(intent, session, callback);
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

var CARD_TITLE = "Recipe Assistant";

function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var speechOutput = "Recipe assistant, what recipe would you like to make ";
    var repromptText = 'What recipe would you like to make?';

    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
}

function doConfusedResponse(intent, session, callback) {
    var output = "Sorry I got confused. What kind of recipe can I help you with?"
        callback(session.attributes,
        buildSpeechletResponse(CARD_TITLE, output, output, false));
}


function findFoodRecipe(intent, session, callback) {
    var queryFood = intent.slots.Food.value;
    console.log("FOOD Q:", intent, queryFood);


    if (!session.attributes) {
        session.attributes = {};
    }

    getRequest(BASE_URL + '&RecipeName='+queryFood, function(success, cb) {
        if (!success) {
            var output = "There was an error when trying to fetch recipes";
            return callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));
        }

        var numFound = cb['Items'].length;

        if (numFound > 1) {
            var output = "I found " + numFound + " items: "
            cb['Items'].forEach(function(element) {
               output += element['RecipeName'] + ', ';
            });
            output += '. Could you be more specific about what you would like to make?';
            callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));
        } else if (numFound == 0) {
            var output = "There were no matching items for " + queryFood + ".";
            callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, output, output, false));
        } else {
            // One Item
            var recipe = cb['Items'][0]
            var output = "Great! Let's get cooking. You can ask me for the ingredients or to read the recipe";
            session.attributes.currentRecipe = recipe
            session.attributes.currentFood = recipe['RecipeName']
            session.attributes.currentIngredients = recipe['Ingredients'].split(/\r?\n/)
            session.attributes.currentDirections = recipe['Directions'].split(/\r?\n/)
            session.attributes.ingredientIndex = 0
            callback(session.attributes,
                buildSpeechletResponse(recipe['RecipeName'], output, output, false, recipe['URL']));
        }
    });
}

function listIngredient(intent, session, callback) {
    if (!session.attributes.currentIngredients) {
        return doConfusedResponse(intent, session, callback);
    }
    if (session.attributes.ingredientIndex >= (session.attributes.currentIngredients.length)) {
        var output = "There are no more ingredients. You can start the recipe by saying start";
    } else {
        var ingredient = session.attributes.currentIngredients[session.attributes.ingredientIndex]
        var output = session.attributes.currentIngredients[session.attributes.ingredientIndex];
        if (session.attributes.ingredientIndex === (session.attributes.currentIngredients.length -1)) {
            output  += ". That's the last one - say start recipe when you have got " + ingredient + ".";
        }
    }
    callback(session.attributes,
        buildSpeechletResponse(CARD_TITLE, output, output, false));
}

function listIngredients(intent, session, callback) {
    session.attributes.ingredientMode = true;
    session.attributes.directionsMode = false;
    session.attributes.ingredientIndex = 0;
    listIngredient(intent, session, callback)
}

function listStep(intent, session, callback) {
    if (!session.attributes.currentDirections) {
        return doConfusedResponse(intent, session, callback);
    }
    if (session.attributes.directionsIndex >= (session.attributes.currentDirections.length)) {
        var output = "There are no more steps. You can return to the main menu by saying restart";
    } else {
        var output = "Step " + session.attributes.directionsIndex + ": "  + session.attributes.currentDirections[session.attributes.directionsIndex];
    }
    callback(session.attributes,
        buildSpeechletResponse(CARD_TITLE, output, output, false));
}

function listSteps(intent, session, callback) {
    session.attributes.directionsMode = true;
    session.attributes.ingredientMode = false;
    session.attributes.directionsIndex = 0;
    listStep(intent, session, callback)
}


function nextStep(intent, session, callback) {
    if (session.attributes.ingredientMode) {
        session.attributes.ingredientIndex += 1;
        listIngredient(intent, session, callback)
    } else if (session.attributes.directionsMode) {
        session.attributes.directionsIndex += 1;
        listStep(intent, session, callback)

    } else {
        return doConfusedResponse(intent, session, callback);
    }
}
function lastStep(intent, session, callback) {
    if (session.attributes.ingredientMode) {
        session.attributes.ingredientIndex = session.attributes.currentIngredients.length - 1;
        listIngredient(intent, session, callback)
    } else if (session.attributes.directionsMode) {
        session.attributes.directionsIndex = session.attributes.currentDirections.length - 1;
        listStep(intent, session, callback)
    } else {
        return doConfusedResponse(intent, session, callback);
    }
}

function quitIntent(intent, session, callback) {
    var output = "Ok. "
    if (session.attributes.ingredientMode) {
        session.attributes.ingredientMode = false;
        return handleMainMenu(intent, session, callback)
    } else if (session.attributes.directionsMode) {
        session.attributes.directionsMode = false;
        return handleMainMenu(intent, session, callback)
    } else {
        return handleFinishSessionRequest(intent, session, callback)
    }
}


function handleMainMenu(intent, session, callback) {
    session.attributes.ingredientMode = false;
    session.attributes.directionsMode = false;
    return getWelcomeResponse(callback);
}


function handleRestartActivity(intent, session, callback) {
    return doConfusedResponse(intent, session, callback);
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
    if (session.attributes.ingredientMode) {
        var speechOutput = "You can ask me to go to the next ingredient or to the last ingredient, or to start reading the recipe. To return to the main menu - say main menu or quit";
    } else {
        var speechOutput = "You can say something like 'find burgers' or 'I would like to make mac and cheese' or quit";
    }
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, speechOutput, false));
}

function handleFinishSessionRequest(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Bon appetit!", "", true));
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


function buildSpeechletResponse(title, output, repromptText, shouldEndSession, image) {
    console.log("Image", image);
    if (!image) {
        var card = {
            type: "Simple",
            title: repromptText,
            content: output
        }
    } else {
        var card = {
            type: 'Standard',
            title: title,
            text: output,
            image: {
              smallImageUrl: image,
              largeImageUrl: image
            }
        }
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
