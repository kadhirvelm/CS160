import React from 'react'
import { mapStateToProps } from './State/StateMethods'
import { connect } from 'react-redux'

import Home from './Tabs/Home'

import Flexbox from 'flexbox-react'

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = this.propsConst(props)
  }

  propsConst = (props) => {
    return ({
      dispatch: props.dispatch,
      isFetching: props.amazonDB.isFetching,
      allRecipes: props.amazonDB.data,
      errorMessage: props.amazonDB.errorMessage,
      resetForm: props.amazonDB.resetForm,
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  render() {
    return (
      <Flexbox flexDirection='column'>
        <Home dispatch={ this.state.dispatch } isFetching={ this.state.isFetching } allRecipes={ this.state.allRecipes } resetForm={ this.state.resetForm } />
      </Flexbox>
    )
  }
}

export default connect(mapStateToProps)(App)
