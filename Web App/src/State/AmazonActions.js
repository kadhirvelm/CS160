import $ from 'jquery' 

export const FAILED_REQUEST = 'FAILED_REQUEST'

export const RECIPE_REQUEST = 'RECIPE_REQUEST'
export const RECIPE_SUCCESS = 'RECIPE_SUCCESS'

function failed(message){
	return {
		type: FAILED_REQUEST,
		isFetching: false,
		message,
	}
}

function requestRecipe(){
	return {
		type: RECIPE_REQUEST,
		isFetching: true,
	}
}

function successRecipe(data){
	return {
		type: RECIPE_SUCCESS,
		isFetching: false,
		data,
	}
}

export function getRecipe(){
	return dispatch => {
		dispatch(requestRecipe())

		$.ajax({
			url: 'https://ddx0dwb6p8.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate',
			data: {
				'TableName': 'Recipes',
			},
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: function(data) {
				dispatch(successRecipe(data))
			},
			error: function(error) {
				dispatch(failed(error))
			}
		})
	}
}

export const NEW_RECIPE_REQUEST = 'NEW_RECIPE_REQUEST'
export const NEW_RECIPE_SUCCESS = 'NEW_RECIPE_SUCCESS'

function newRecipeRequest(){
	return {
		type: NEW_RECIPE_REQUEST,
		isFetching: true,
	}
}

function newRecipeSuccess(data){
	return {
		type: NEW_RECIPE_SUCCESS,
		isFetching: false,
	}
}

export function newRecipe(tableName, item){
	return dispatch => {
		dispatch(newRecipeRequest())

		$.ajax({
			url: 'https://ddx0dwb6p8.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate',
			data: {
				'TableName': { tableName },
				'Item' : { item },
			},
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function(data) {
				dispatch(newRecipeSuccess(data))
			},
			error: function(error) {
				dispatch(failed(error))
			}
		})
	}
}