import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { 
	FAILED_REQUEST,
	RECIPE_REQUEST, RECIPE_SUCCESS,
	NEW_RECIPE_REQUEST, NEW_RECIPE_SUCCESS,
} from './AmazonActions'

function amazonDB(state = {
	isFetching: false
}, action) {
	const fetch = {
		isFetching: action.isFetching,
	}
	switch (action.type) {
		case FAILED_REQUEST:
			return Object.assign({}, state, fetch, {
				errorMessage: action.message,
			})
		case RECIPE_REQUEST:
			return Object.assign({}, state, fetch)
		case  RECIPE_SUCCESS:
			return Object.assign({}, state, fetch, {
				data: action.data,
			})
		case NEW_RECIPE_REQUEST:
			return Object.assign({}, state, fetch)
		case NEW_RECIPE_SUCCESS:
			return Object.assign({}, state, fetch)
		default:
			return state
	}
}

import {
	LOADING_RECIPE
} from './WebsiteActions'

function website(state = {}, action) {
	switch(action.type){
		case LOADING_RECIPE:
			return Object.assign({}, state)
		default:
			return state
	}
}

import { reducer } from 'redux-form'

const proj3 = combineReducers({
	amazonDB,
	website,
	routing: routerReducer,
	form: reducer
})

export default proj3