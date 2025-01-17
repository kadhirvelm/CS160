import os

from flask import Flask, jsonify, request, make_response, abort
from flask_cors import CORS, cross_origin

app = Flask(__name__)
from pyramda import pick, keys, getitem
import requests

CORS(app)

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

data = {}

class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

@app.route('/final_recipe', methods=['GET', 'POST'] )
def set_final_recipe():
    if request.method == 'GET':
        return jsonify(data['final_recipe']) if 'final_recipe' in data else jsonify({ 'message': 'Error, user hasn\'t selected recipe' })
    else:
        final_recipe = pick(['final_recipe'], request.json)
        data['final_recipe'] = final_recipe
        return jsonify({ 'message': 'Successfully selected recipe' })

@app.route('/choose/<int:rid>', methods=['GET', 'POST'] )
def get_recipe_with_id(rid):
    # Bad practice to modify on GET, but w/e
    if 'recipes' not in data:
        # Todo just query for the right one
        return jsonify({'message': 'No original query'}), 400

    filtered = [r for r in data['recipes']['results'] if r.get('id') == rid]
    if not filtered:
        return jsonify({'message': 'Doesnt exist'}), 400

    final_recipe = filtered[0]
    data['final_recipe'] = final_recipe
    return jsonify(final_recipe)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.route('/recipes', methods=['GET', 'POST'])
def get_current_recipes():
    if request.method == 'GET':
        return jsonify(data['recipes'] if 'recipes' in data else {})
    else:
        return send_new_recipe_request()

def send_new_recipe_request():
    try:
        valid_input = check_valid_input(request.json)
        if len(valid_input['errors']) > 0: raise InvalidUsage(valid_input['errors'], status_code=400)
        user_specified_parameters = valid_input['filters']
        response = requests.get(
            url='https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex',
            params={
                'cuisine': user_specified_parameters.get('cuisine', ''),
                'diet': user_specified_parameters.get('diet', ''),
                'excludeIngredients': user_specified_parameters.get('excludeIngredients', ''),
                'includeIngredients': user_specified_parameters.get('includeIngredients', ''),
                'intolerances': user_specified_parameters.get('intolerances', ''),
                'type': user_specified_parameters.get('type', ''),
                'fillIngredients': 'true',
                'addRecipeInformation': 'true',
                'instructionsRequired': 'true',
                'limitLicense': 'false',
                'number': '50',
                'offset': '0',
                'ranking': '2',
            },
            headers={
                'X-Mashape-Key': os.environ.get('SPOON_KEY', 'None'),
                'Accept': 'application/json',
            },
        )
        data['recipes'] = response.json()
        return jsonify(response.json())
    except requests.exceptions.RequestException:
        return jsonify({'message': 'HTTP Request failed'})

def check_valid_input(requestJSON):
    possible_parameters = {
        'cuisine': [ 'african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian', 'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun', 'southern', 'greek', 'german', 'nordic', 'eastern european', 'caribbean', 'latin american', '' ],
        'diet': ['pescetarian', 'lacto vegetarian', 'ovo vegetarian', 'vegan', 'paleo', 'primal', 'vegetarian', '' ],
        'excludeIngredients': [ '' ],
        'includeIngredients': [ '' ],
        'intolerances': ['dairy', 'egg', 'gluten', 'peanut', 'sesame', 'seafood', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat', '' ],
        'type': ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'drink', '' ],
    }
    requestJSON = pick(keys(possible_parameters), requestJSON)
    data['filters'] = requestJSON
    errors = []
    for key in requestJSON:
        if (key != 'excludeIngredients') and (key != 'includeIngredients') and (requestJSON[key] not in possible_parameters[key]):
            errors.append({'Error with ' + key: 'Expected one of: ' + ', '.join(possible_parameters[key])})
    return {'filters': requestJSON, 'errors': errors }

@app.route('/filters', methods=['GET'])
def get_current_filters():
    return jsonify(data['filters'] if 'filters' in data else {})

@app.route('/reset', methods=['GET'])
def reset():
    for key in data.keys():
        data.pop(key)
    return jsonify({ 'message': 'Reset Successfully' })

if __name__ == '__main__':
    app.run()
