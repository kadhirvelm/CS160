import $ from 'jquery' 

export const current_server = 'http://62a3fe21.ngrok.io'

export const FAILED_REQUEST = 'FAILED_REQUEST'

export const FETCH_CURRENT_RECIPES_REQUEST = 'FETCH_CURRENT_RECIPES_REQUEST'
export const FETCH_CURRENT_RECIPES_SUCCESS = 'FETCH_CURRENT_RECIPES_REQUEST'

function failed(message){
	return {
		type: FAILED_REQUEST,
		isFetching: false,
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

export const FETCH_CURRENT_FILTERS_REQUEST = 'FETCH_CURRENT_FILTERS_REQUEST'
export const FETCH_CURRENT_FILTERS_SUCCESS = 'FETCH_CURRENT_FILTERS_SUCCESS'

function requestCurrentFilters(){
	return {
		type: FETCH_CURRENT_FILTERS_REQUEST,
		isFetching: true,
	}
}

function currentFiltersSuccess(filters){
	return {
		type: FETCH_CURRENT_FILTERS_SUCCESS,
		isFetching: false,
		filters
	}
}

export function getCurrentFilters(callback){
	return dispatch => {
		dispatch(requestCurrentFilters())

		$.ajax({
			url: current_server + '/filters',
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: function(data) {
				dispatch(currentFiltersSuccess(data))
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

export const SUBMIT_NEW_RECIPES_REQUEST = 'SUBMIT_NEW_RECIPES_REQUEST'
export const SUBMIT_NEW_RECIPES_SUCCESS = 'SUBMIT_NEW_RECIPES_SUCCESS'

function newRecipesRequest(){
	return {
		type: SUBMIT_NEW_RECIPES_REQUEST,
		isFetching: true,
	}
}

function newRecipesSuccess(recipes){
	return {
		type: SUBMIT_NEW_RECIPES_SUCCESS,
		isFetching: false,
		recipes,
	}
}

export function submitNewRecipe(filters, callback){
	return dispatch => {
		dispatch(newRecipesRequest())
		$.ajax({
			url: current_server + '/recipes',
			type: 'POST',
			data: JSON.stringify(filters),
			dataType: 'json',
			cache: false,
			success: function(data) {
				dispatch(newRecipesSuccess(data))
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

export const RESET_REQUEST = 'RESET_REQUEST'
export const RESET_SUCCESS = 'RESET_SUCCESS'

function resetRequest(){
	return {
		type: RESET_REQUEST,
		isFetching: true,
	}
}

function resetSuccess(message){
	return {
		type: RESET_SUCCESS,
		isFetching: false,
		message,
	}
}

export function reset(callback){
	return dispatch => {
		dispatch(resetRequest())

		$.ajax({
			url: current_server + '/reset',
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function(data) {
				dispatch(resetSuccess(data))
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