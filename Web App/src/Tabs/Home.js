import React from 'react'

import { Tabs, Tab } from 'material-ui/Tabs'
import Flexbox from 'flexbox-react'

import { getRecipe, newRecipe } from '../State/AmazonActions'

import Recipes from './Recipes'
import CreateRecipe from './CreateRecipe'

import { chain } from 'ramda'

class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      isFetching: props.isFetching,
      autoCompleteDataSource: [],
      tiles: [],
    })
  }

  componentWillMount(){
    const getRecipes = this.getAllRecipes(this.state)
    getRecipes.then( (values) => {
      const organizeTiles = (entry) => entry.name
      const autoCompleteDataSource = chain(organizeTiles, values.Items)
      console.log(autoCompleteDataSource, values.Items)
      this.setState({ autoCompleteDataSource: autoCompleteDataSource, tiles: values.Items })
    })
  }

  getAllRecipes = (state) => {
    return new Promise( function(resolve) {
      state.dispatch(getRecipe(resolve))
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst)
  }

  handleRequest = (value) => {
    console.log(value)
  }

  handleSubmit = (values) => {
    var readFile = new Promise( function(resolve) {
      const reader = new FileReader()
      reader.onload = function(theFile) {
        const item = {
          name: values.recipeNameText,
          image: theFile.currentTarget.result,
          ingredients: values.ingredientsList,
          directions: values.directions,
        }
        resolve(item)
      }
      reader.readAsDataURL(values.recipeImage.item(0))
    })
    readFile.then( (item) => {
      this.state.dispatch(newRecipe('Recipes', item))
    })
  }

  render() {
    return (
      <Flexbox flexDirection='column'>
        <Tabs>
          <Tab label='Home'>
            <Recipes autoCompleteDataSource={ this.state.autoCompleteDataSource } tiles={ this.state.tiles } />
          </Tab>
          <Tab label='Create Recipe'>
            <CreateRecipe onSubmit={ this.handleSubmit } />
          </Tab>
        </Tabs>
      </Flexbox>
    );
  }
}

export default Home
