import React from 'react'
import Flexbox from 'flexbox-react'

import { mapStateToProps } from '../State/StateMethods'
import { connect } from 'react-redux'

import { getCurrentRecipes, getCurrentFilters, resetRequest, submitNewRecipe } from '../State/ServerActions'

class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
    this.state.dispatch(getCurrentRecipes())
  }

  propsConst = (props) => {
    return({
      dispatch: props.dispatch,
      isFetching: props.isFetching,
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  dispatchAction = (newDBEntry) => { this.state.dispatch(getCurrentRecipes()) }

  render() {
    console.log(this.props)
    return (
      <Flexbox flexDirection='column'>
        <div>
          { this.props.isFetching }
          { this.props.recipes }
        </div>
      </Flexbox>
    );
  }
}

export default connect(mapStateToProps)(Home)
