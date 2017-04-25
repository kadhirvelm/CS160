import React from 'react'
import Flexbox from 'flexbox-react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import { head } from 'ramda'

class SpecificRecipe extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      previousStep: props.previousStep,
      setFinalRecipe: props.setFinalRecipe,
      final_recipe: props.final_recipe,
      viewingRecipe: props.viewingRecipe,
      newSelection: props.newSelection,
      selectedDish: (props.final_recipe === undefined ? 0 : props.final_recipe.id) === props.viewingRecipe.id,
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  setFinalRecipe = () => { this.state.setFinalRecipe(this.state.viewingRecipe) }

  render() {
    const actions = [
      <FlatButton
        label='New Selection'
        primary={ true }
        onTouchTap={ this.state.newSelection }
      />,
    ]
    return (
      <Flexbox flexDirection='column' flexGrow={ 1 } style={ { margin: '10px' } }>
        <Flexbox flexDirection='row' justifyContent='center'>
          { this.state.viewingRecipe.title }
        </Flexbox>
        <Flexbox justifyContent='center'>
          <img src={ this.state.viewingRecipe.image } style={ { maxHeight: '400px', width: 'auto', border: 'grey', borderWidth: '1px', borderStyle: 'solid' } }/>
        </Flexbox>
        <Flexbox flexDirection='column' alignItems='center' justifyContent='center'>
          <div>
            Preparation: { this.state.viewingRecipe.preparationMinutes }
          </div>
          <div>
            Ready in: { this.state.viewingRecipe.readyInMinutes }
          </div>
          <Flexbox alignItems='center'> 
            <img src='http://clipartix.com/wp-content/uploads/2016/04/Thumbs-up-clipart-cliparts-for-you.jpg' height='20' width='20' /> &nbsp; { this.state.viewingRecipe.aggregateLikes } 
          </Flexbox>
        </Flexbox>
        <Flexbox flexDirection='column' style={ { margin: '15px' } }>
          { head(this.state.viewingRecipe.analyzedInstructions).steps.map( (entry, index) => (
            <Flexbox key={ index }> { index + 1 } : { entry.step } </Flexbox>
            )) 
          }
        </Flexbox>
        <Flexbox flexDirection='column' flexGrow={ 1 } justifyContent='center'>
          <RaisedButton label='Cook It!' onClick={ this.setFinalRecipe } fullWidth={ true } style={ { margin: '7px' } }/>
          <Flexbox justifyContent='center'>
            <RaisedButton label='Back' onClick={ this.state.previousStep } />
          </Flexbox>
        </Flexbox>
        <Dialog
          title='Cooking'
          actions={ actions }
          modal={ true }
          open={ this.state.selectedDish }
        >
          <div> Good luck making { this.state.viewingRecipe.title }! </div>
          <div> Go ahead and let Alexa know you're ready to begin </div>
        </Dialog>
      </Flexbox>
    )
  }
}

export default SpecificRecipe
