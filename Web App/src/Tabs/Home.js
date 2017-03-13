import React from 'react'

import { Tabs, Tab } from 'material-ui/Tabs'
import Flexbox from 'flexbox-react'

import {GridList, GridTile} from 'material-ui/GridList'
import AutoComplete from 'material-ui/AutoComplete'
import CircularProgress from 'material-ui/CircularProgress'

import { getRecipe } from '../State/AmazonActions'

class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      isFetching: props.isFetching,
      tiles: []
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
      state.dispatch(getRecipe(), resolve)
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst)
  }

  handleRequest = (value) => {
    console.log(value)
  }

  render() {
    return (
      <Flexbox flexDirection='column'>
        <Tabs>
          <Tab label='Home'>
            { this.state.isFetching &&
              <CircularProgress />
            }
            <AutoComplete
              hintText='Search Recipes'
              dataSource={ this.state.autoCompleteDataSource ? this.state.autoCompleteDataSource : [ 'None' ] }
              filter={ AutoComplete.caseInsensitiveFilter }
              onNewRequest={ this.handleRequest }
              fullWidth={ true }
            />
            <GridList cellHeight={ 180 }>
            { this.state.tiles.map( (tile, index) => (
              <GridTile key={ index } title={ tile.name }>
                <img src={ tile.image } />
              </GridTile>
              ))}
            </GridList>
          </Tab>
        </Tabs>
      </Flexbox>
    );
  }
}

export default Home
