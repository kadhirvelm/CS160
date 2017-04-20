import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { 
	FAILED_REQUEST,
	FETCH_CURRENT_RECIPES_REQUEST, FETCH_CURRENT_RECIPES_SUCCESS,
	FETCH_CURRENT_FILTERS_REQUEST, FETCH_CURRENT_FILTERS_SUCCESS,
	SUBMIT_NEW_RECIPES_REQUEST, SUBMIT_NEW_RECIPES_SUCCESS,
	RESET_REQUEST, RESET_SUCCESS
} from './ServerActions'

function serverActions(state = {
	isFetching: false
}, action) {
	const fetch = {
		isFetching: action.isFetching,
	}
	switch (action.type) {
		case FAILED_REQUEST:
			return Object.assign({}, state, fetch, {
				message: action.message,
			})
		case FETCH_CURRENT_RECIPES_REQUEST:
			return Object.assign({}, state, fetch)
		case  FETCH_CURRENT_RECIPES_SUCCESS:
			return Object.assign({}, state, fetch, {
				recipes: action.recipes,
			})
		case FETCH_CURRENT_FILTERS_REQUEST:
			return Object.assign({}, state, fetch)
		case  FETCH_CURRENT_FILTERS_SUCCESS:
			return Object.assign({}, state, fetch, {
				filters: action.filters,
			})
		case SUBMIT_NEW_RECIPES_REQUEST:
			return Object.assign({}, state, fetch)
		case  SUBMIT_NEW_RECIPES_SUCCESS:
			return Object.assign({}, state, fetch, {
				recipes: action.recipes,
			})
		case RESET_REQUEST:
			return Object.assign({}, state, fetch)
		case RESET_SUCCESS:
			return Object.assign({}, state, fetch, {
				message: action.message
			})
		default:
			return state
	}
}

import { reducer } from 'redux-form'

const proj3 = combineReducers({
	serverActions,
	routing: routerReducer,
	form: reducer
})

export default proj3