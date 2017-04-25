import React from 'react'
import Flexbox from 'flexbox-react'
import './Home.css'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { mapStateToProps } from '../State/StateMethods'
import { connect } from 'react-redux'

import Filters from './Filters'
import AllRecipes from './AllRecipes'
import SpecificRecipe from './SpecificRecipe'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'

import { 
  getCurrentRecipes, 
  getCurrentFilters, 
  reset, 
  submitNewRecipe, 
  setFinalRecipe, getFinalRecipe 
} from '../State/ServerActions'

class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      isFetching: props.serverActions.isFetching,
      message: props.serverActions.message,
      recipes: props.serverActions.recipes,
      filters: props.serverActions.filters,
      final_recipe: props.serverActions.final_recipe,
      currentStep: this.state ? this.state.currentStep : 0,
      openWarning: this.state ? this.state.openWarning : false,
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  getCurrentRecipes = () => { this.state.dispatch(getCurrentRecipes()) }

  getCurrentFilters = () => { this.state.dispatch(getCurrentFilters()) }

  reset = (callback) => { this.state.dispatch(reset(callback)) }
  
  submitNewRecipe = (filters) => { this.state.dispatch(submitNewRecipe(filters)) }

  setFinalRecipe = (recipe) => { this.state.dispatch(setFinalRecipe(recipe, this.getFinalRecipe )) }

  getFinalRecipe = () => { this.state.dispatch(getFinalRecipe()) }

  setViewingRecipe = (recipe) => { this.setState({ viewingRecipe: recipe }) }

  setZeroStep = () => { this.setState({ currentStep: 0 }) }
  newSelection = () => { this.reset(this.setZeroStep) }

  nextStep = () => { this.setState({ currentStep: ++this.state.currentStep }) }
  previousStep = () => { this.setState({ currentStep: --this.state.currentStep }) }

  currentStep = () => {
    switch (this.state.currentStep){
      case 0:
        return <Filters key='Filters' nextStep={ this.nextStep } getCurrentFilters={ this.getCurrentFilters } 
        filters={ this.state.filters } />
      case 1:
        return <AllRecipes key='AllRecipes' nextStep={ this.nextStep } previousStep={ this.previousStep } 
        getCurrentRecipes={ this.getCurrentRecipes } getFinalRecipe={ this.setFinalRecipe } 
        recipes={ this.state.recipes } setViewingRecipe={ this.setViewingRecipe } />
      case 2:
        return <SpecificRecipe key='SpecificRecipe' previousStep={ this.previousStep } setFinalRecipe={ this.setFinalRecipe } 
        viewingRecipe={ this.state.viewingRecipe } final_recipe={ this.state.final_recipe } newSelection={ this.newSelection } />
      default:
        return <div> Oops, something went wrong </div>
    }
  }

  changeWarning = () => {
    this.setState({ openWarning: !this.state.openWarning })
  }

  resetApp = () => { this.reset(this.changeWarning) }

  render() {
    const actions = [
      <FlatButton
        label='Cancel'
        secondary={ true }
        onTouchTap={ this.changeWarning }
      />,
      <FlatButton
        label='Yes'
        primary={ true }
        onTouchTap={ this.resetApp }
      />,
    ]
    return (
      <Flexbox flexDirection='column'>
        <Flexbox flexDirection='row' style={ { marginBottom: '10px' } }>
          <Flexbox flexGrow={ 1 }>
          </Flexbox>
          <Flexbox justifyContent='center' flexGrow={ 2 }>
            Hello CS 160
          </Flexbox>
          <Flexbox flexGrow={ 1 } justifyContent='flex-end'>
            { this.state.isFetching &&
              <CircularProgress />
            }
          </Flexbox>
        </Flexbox>
        <ReactCSSTransitionGroup
            transitionName='example'
            transitionEnterTimeout={ 500 }
            transitionLeaveTimeout={ 300 }>
          <Flexbox key={ this.state.currentStep } style={ { marginTop: '10px' } }>
            { this.currentStep() }
          </Flexbox>
        </ReactCSSTransitionGroup>
        <Flexbox>
          <RaisedButton label='Reset' onClick={ this.changeWarning } fullWidth={ true } />
        </Flexbox>
        <Dialog
          title='Reset Sous Chef?'
          actions={ actions }
          modal={ true }
          open={ this.state.openWarning }
        >
          Are you sure you want to reset Sous Chef? You can't undo this action.
        </Dialog>
      </Flexbox>
    );
  }
}

export default connect(mapStateToProps)(Home)
