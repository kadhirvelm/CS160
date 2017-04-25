import React from 'react'
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
    })
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.propsConst(nextProps))
  }

  render() {
    return (
      <Flexbox flexDirection='column'>
        <Home dispatch={ this.state.dispatch } />
      </Flexbox>
    )
  }
}

export default App
