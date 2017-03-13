import React from 'react'

import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Upload from 'material-ui-upload/Upload'

const validate = values => {
	const errors = {}
	const requiredFields = [ 'recipeNameText', 'recipeImage', 'ingredientsList', 'directions' ]
	requiredFields.forEach( (field) => {
		if (!values[field]) {
			errors[ field ] = 'Required'
		}
		if(values.recipeImage && !/image\/.*/.test(values.recipeImage[0].type)) {
			errors.recipeImage = 'Only images are allowed'
		}
	})
	return errors
}

const picturePreview = {
	marginTop: '10px',
	height: 'auto',
	width: 'auto',
	maxWidth: '150px',
	maxHeight: '150px',
	display: 'block',
	marginLeft: 'auto',
	marginRight: 'auto',
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

	componentWillMount(){
		this.props.reset()
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

	onFileLoad = (e) => this.setState({ picture: e.target.result })

	imageField = ({ input, meta: {touched, error } }) => (
		<div>
			<Upload id='recipeImage' label='Upload Image' onFileLoad={ this.onFileLoad } style={ { width: '100%' } } { ...input } />
			<font color='red'> { touched && error } </font>
		</div>
	)

	ingredientsList = ({ input, meta: {touched, error } }) => (
		<TextField id='ingredientsList'
		floatingLabelText='Ingredients'
		errorText={ touched && error }
		multiLine={ true } rows={ 3 } rowsMax={ 5 } 
		fullWidth={ true }
		{ ...input }
		/>
	)

	directions = ({ input, meta: {touched, error } }) => (
		<TextField id='directions'
		floatingLabelText='Directions'
		errorText={ touched && error }
		multiLine={ true } rows={ 5 } rowsMax={ 7 }
		fullWidth={ true }
		{ ...input }
		/>
	)

	render(){
		const { handleSubmit } = this.props
		return (
			<form onSubmit={ handleSubmit }>
				<Field name='recipeNameText' component={ this.recipeNameText } label='Recipe Name' />
				<Field name='recipeImage' component={ this.imageField } label='Recipe Image' />
				{ this.state.picture &&
					<img src={ this.state.picture } style={ picturePreview } role='presentation' />
				}
				<Field name='ingredientsList' component={ this.ingredientsList } label='Ingredient List' />
				<Field name='directions' component={ this.directions } label='Directions' />
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