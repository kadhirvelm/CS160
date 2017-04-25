import React from 'react'
import Flexbox from 'flexbox-react'
import './Home.css'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import RaisedButton from 'material-ui/RaisedButton'
import { GridList, GridTile } from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import Subheader from 'material-ui/Subheader'

import { curry } from 'ramda'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 1000,
    height: 800,
    overflowY: 'auto',
  },
}

class AllRecipes extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      nextStep: props.nextStep,
      previousStep: props.previousStep,
      getCurrentRecipes: props.getCurrentRecipes,
      getFinalRecipe: props.getFinalRecipe,
      recipes: props.recipes ? props.recipes : [],
      setViewingRecipe: props.setViewingRecipe,
    })
  }

  componentWillMount(){
    this.state.getCurrentRecipes()
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  viewSpecificRecipe = (entry, event) => {
    this.state.setViewingRecipe(entry)
    this.state.nextStep()
  }

  currySpecificRecipe = curry(this.viewSpecificRecipe)

  render() {
    return (
      <Flexbox flexDirection='column' flexGrow={ 1 } style={ { margin: '10px' } }>
        <RaisedButton label='Refresh' onClick={ this.state.getCurrentRecipes } style={ { margin: '5px' } }/>
        <Flexbox flexDirection='row' flexGrow={ 1 } style={ styles.root }>
          <GridList
            cellHeight={ 180 }
            style={ styles.gridList }>
            { (this.state.recipes).map( (entry, index) => (
                <GridTile key={ index } title={ entry.title } subtitle={ entry.creditText } onClick={ this.currySpecificRecipe(entry) }>
                  <img src={ entry.image } />
                </GridTile>
              ))
            }
          </GridList>
        </Flexbox>
        <RaisedButton label='Back' onClick={ this.state.previousStep } />
      </Flexbox>
    );
  }
}

export default AllRecipes
