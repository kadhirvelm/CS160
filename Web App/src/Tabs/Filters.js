import React from 'react'
import Flexbox from 'flexbox-react'
import './Home.css'

import RaisedButton from 'material-ui/RaisedButton'

import { keys, pick, values } from 'ramda'

class Filters extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      nextStep: props.nextStep,
      getCurrentFilters: props.getCurrentFilters,
      filters: (props.filters === undefined) ? [] : props.filters,
    })
  }

  componentWillMount(){
    this.state.getCurrentFilters()
  }

  possible_parameters = () => {
    return({
      'cuisine': [ 'african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian', 'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun', 'southern', 'greek', 'german', 'nordic', 'eastern european', 'caribbean', 'latin american', '' ],
      'diet': ['pescetarian', 'lacto vegetarian', 'ovo vegetarian', 'vegan', 'paleo', 'primal', 'vegetarian', '' ],
      'excludeIngredients': [ '' ],
      'includeIngredients': [ '' ],
      'intolerances': ['dairy', 'egg', 'gluten', 'peanut', 'sesame', 'seafood', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat', '' ],
      'type': ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'drink', '' ],
    })
  }
  
  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  render() {
    return (
      <Flexbox flexDirection='column' flexGrow={ 1 } style={ { margin: '10px' } }>
        <Flexbox justifyContent='flex-end' style={ { margin: '5px' } } >
          <RaisedButton label='Refresh' onClick={ this.state.getCurrentFilters } />
        </Flexbox>
        <Flexbox flexDirection='column' alignItems='center'>
          <h3> Selected Filters </h3>
          { keys(this.possible_parameters()).map( (key, index) => (
            <Flexbox flexDirection='row' flexGrow={ 1 } key={ index }> 
            <p> { key } &nbsp; </p> {
              values(pick([ key ], this.state.filters)).map( (filter, index) => (
                <font key={ index }> { filter } </font>
              ))
            }
            </Flexbox>
            ))
          }
        </Flexbox>
        <Flexbox justifyContent='flex-end'>
          <RaisedButton label='Next' onClick={ this.state.nextStep } />
        </Flexbox>
      </Flexbox>
    );
  }
}

export default Filters
