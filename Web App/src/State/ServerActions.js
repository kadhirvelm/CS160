import $ from 'jquery' 

export const current_server = 'http://62a3fe21.ngrok.io'

export const FAILED_REQUEST = 'FAILED_REQUEST'

export const FETCH_CURRENT_RECIPES_REQUEST = 'FETCH_CURRENT_RECIPES_REQUEST'
export const FETCH_CURRENT_RECIPES_SUCCESS = 'FETCH_CURRENT_RECIPES_REQUEST'

export const FETCH_CURRENT_FILTERS_REQUEST = 'FETCH_CURRENT_FILTERS_REQUEST'
export const FETCH_CURRENT_FILTERS_SUCCESS = 'FETCH_CURRENT_FILTERS_SUCCESS'

export const SUBMIT_NEW_RECIPES_REQUEST = 'SUBMIT_NEW_RECIPES_REQUEST'
export const SUBMIT_NEW_RECIPES_SUCCESS = 'SUBMIT_NEW_RECIPES_SUCCESS'

function failed(message){
	return {
		type: FAILED_REQUEST,
		isFetching: false,
		resetForm: true,
		message,
	}
}

function requestCurrentRecipes(){
	return {
		type: FETCH_CURRENT_RECIPES_REQUEST,
		isFetching: true,
	}
}

function currentRecipesSuccess(recipes){
	return {
		type: FETCH_CURRENT_RECIPES_SUCCESS,
		isFetching: false,
		recipes,
	}
}

export function getCurrentRecipes(callback){
	return dispatch => {
		dispatch(requestCurrentRecipes())

		$.ajax({
			url: current_server + '/recipes',
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: function(data) {
				dispatch(currentRecipesSuccess(data))
				if (callback){
					callback(data)
				}
			},
			error: function(error) {
				dispatch(failed(error))
			}
		})
	}
}