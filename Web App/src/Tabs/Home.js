import React from 'react'

import { Tabs, Tab } from 'material-ui/Tabs'
import Flexbox from 'flexbox-react'

import { getRecipe } from '../State/AmazonActions'

import Recipes from './Recipes'
import CreateRecipe from './CreateRecipe'

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
      console.log(values)
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
    console.log(values)
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
