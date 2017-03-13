import React from 'react'

import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Flexbox from 'flexbox-react'

const validate = values => {
	const errors = {}
	const requiredFields = [ 'Name', 'Image', 'Ingredients', 'Directions' ]
	requiredFields.forEach( (field) => {
		if (!values[field]) {
			errors[ field ] = 'Required'
		}
		return errors
	})
}

class CreateRecipe extends React.Component {
	constructor(props){
		super(props)
		this.state = this.propsConst(props)
	}

	propsConst = (props) => {
		return({
		})
	}

	componentWillReceiveProps(nextProps){
		this.setState(this.propsConst(nextProps))
	}

	recipeNameText = ({ input, meta: { touched, error } }) => (
		<TextField id='recipeNameText'
		floatingLabelText='Recipe Name'
		errorText={ touched && error }
		fullWidth={ true }
		{ ...input }
		/>
	)

	render(){
		const { handleSubmit } = this.props
		return (
			<form onSubmit={ handleSubmit }>
				<Field name='recipeText' component={ this.recipeNameText } label='Recipe Name' />
				<RaisedButton id='submit'
	        type='submit'
	        label='Create Recipe'
	        fullWidth={ true }
	        />
			</form>
		)
	}
}

export default reduxForm({
	form: 'CreateRecipe',
	validate,
})(CreateRecipe)