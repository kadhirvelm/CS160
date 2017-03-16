import React from 'react'

import { Tabs, Tab } from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'
import Flexbox from 'flexbox-react'

import { getRecipe, newRecipe } from '../State/AmazonActions'

import Recipes from './Recipes'
import CreateRecipe from './CreateRecipe'

import { chain, toLower } from 'ramda'

class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      isFetching: props.isFetching,
      autoCompleteDataSource: this.state ? this.state.autoCompleteDataSource : [],
      tiles: this.state ? this.state.tiles : [],
      resetForm: props.resetForm,
    })
  }

  componentWillMount(){
    this.refreshContents()
  }

  refreshContents = () => {
    const getRecipes = this.getAllRecipes(this.state)
    getRecipes.then( (values) => {
      const organizeTiles = (entry) => entry.RecipeName
      const autoCompleteDataSource = chain(organizeTiles, values.Items)
      this.setState({ autoCompleteDataSource: autoCompleteDataSource, tiles: values.Items })
    })
  }

  getAllRecipes = (state) => {
    return new Promise( function(resolve) {
      state.dispatch(getRecipe(resolve))
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
    if (nextProps.resetForm) {
      this.refreshContents()
    }
  }

  handleRequest = (value) => {
    console.log(value)
  }

  handleSubmit = (values) => {
    this.setState({ isFetching: true })
    const uploadFile = this.upload(values.recipeImage.item(0))
    uploadFile.then( (link) => {
      const newRecipe = {
        RecipeName: toLower(values.recipeNameText),
        URL: link,
        Ingredients: values.ingredientsList,
        Directions: values.directions,
      }
      this.dispatchAction(newRecipe)
    })
  }

  dispatchAction = (newDBEntry) => { this.state.dispatch(newRecipe(newDBEntry)) }

  upload(file) {
    return new Promise( function(resolve) {
      var fd = new FormData()
      fd.append("image", file)
      var xhr = new XMLHttpRequest()
      xhr.open("POST", "https://api.imgur.com/3/image.json")
      xhr.onload = function() {
        resolve(JSON.parse(xhr.responseText).data.link)
      }
      xhr.setRequestHeader('Authorization', 'Client-ID 28aaa2e823b03b1')
      xhr.send(fd)
    })
  }

  render() {
    return (
      <Flexbox flexDirection='column'>
        <Tabs>
          <Tab label='View Recipes'>
            <Recipes autoCompleteDataSource={ this.state.autoCompleteDataSource } tiles={ this.state.tiles } />
          </Tab>
          <Tab label='Create Recipe'>
            { this.state.isFetching && 
              <CircularProgress />
            }
            <CreateRecipe onSubmit={ this.handleSubmit } resetForm={ this.state.resetForm } />
          </Tab>
          <Tab label='Settings'>
            Settings Go Here
          </Tab>
        </Tabs>
      </Flexbox>
    );
  }
}

export default Home
