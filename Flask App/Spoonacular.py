import os

from flask import Flask, jsonify, request, make_response, session
app = Flask(__name__)

from pyramda import pick, keys, getitem

import requests

app.secret_key = "A0Zr98j/3yX R~XHH!jmN]LWX/,?RT"

@app.route("/recipes", methods=["GET"])
def get_current_recipes():
	return jsonify(session["recipes"] if "recipes" in session else {})

@app.route("/filters", methods=["GET"])
def get_current_filters():
    return jsonify(session["filters"] if "filters" in session else {})

@app.route("/recipes/new", methods=['POST'])
def send_new_recipe_request():
    try:
        valid_input = check_valid_input(request.json)
        if len(valid_input['errors']) > 0: return jsonify(valid_input['errors'])
        user_specified_parameters = valid_input['filters']
        response = requests.get(
            url="https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex",
            params={
                "cuisine": user_specified_parameters.get("cuisine") or "",
                "diet": user_specified_parameters.get("diet") or "",
                "excludeIngredients": user_specified_parameters.get("excludeIngredients") or "",
                "includeIngredients": user_specified_parameters.get("includeIngredients") or "",
                "intolerances": user_specified_parameters.get("intolerances") or "",
                "type": user_specified_parameters.get("type") or "",
                "fillIngredients": "true",
                "addRecipeInformation": "true",
                "instructionsRequired": "true",
                "limitLicense": "false",
                "number": "20",
                "offset": "0",
                "ranking": "2",
            },
            headers={
                "X-Mashape-Key": os.environ.get('SPOON_KEY', 'None'),
                "Accept": "application/json",
            },
        )
        session['recipes'] = response.json()
        return jsonify(response.json())
    except requests.exceptions.RequestException:
        return('HTTP Request failed')

def check_valid_input(requestJSON):
    possible_parameters = {
        "cuisine": [ "african", "chinese", "japanese", "korean", "vietnamese", "thai", "indian", "british", "irish", "french", "italian", "mexican", "spanish", "middle eastern", "jewish", "american", "cajun", "southern", "greek", "german", "nordic", "eastern european", "caribbean", "latin american", "" ],
        "diet": ["pescetarian", "lacto vegetarian", "ovo vegetarian", "vegan", "paleo", "primal", "vegetarian", "" ],
        "excludeIngredients": [ "" ],
        "includeIngredients": [ "" ],
        "intolerances": ["dairy", "egg", "gluten", "peanut", "sesame", "seafood", "shellfish", "soy", "sulfite", "tree nut", "wheat", "" ],
        "type": ["main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "drink", "" ],
    }
    requestJSON = pick(keys(possible_parameters), requestJSON)
    session["filters"] = requestJSON
    errors = []
    for key in requestJSON:
        if (key != 'excludeIngredients') and (key != 'includeIngredients') and (requestJSON[key] not in possible_parameters[key]):
            errors.append({'Error with ' + key: "Expected one of: " + ', '.join(possible_parameters[key])})
    return {'filters': requestJSON, 'errors': errors }

@app.route('/reset', methods=['GET'])
def reset():
    for key in session.keys():
        session.pop(key)
    return 'Reset Successfully'

if __name__ == "__main__":
	app.run()
