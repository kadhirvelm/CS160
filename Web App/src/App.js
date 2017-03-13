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
    })
  }

  render() {
    console.log(this.props)
    return (
      <Flexbox flexDirection='column'>
        <Home dispatch={ this.state.dispatch } isFetching={ this.state.isFetching } allRecipes={ this.state.allRecipes } />
      </Flexbox>
    )
  }
}

export default connect(mapStateToProps)(App)
