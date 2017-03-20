import React from 'react'

import { Tabs, Tab } from 'material-ui/Tabs'
import Flexbox from 'flexbox-react'

class Settings extends React.Component {
	constructor(props){
		super(props)
		this.state = this.propsConst(props)
	}
		propsConst = (props) => {
		return({
		})
	}
  }
  //  render() {
  //   return (
  //     <Flexbox flexDirection='column'>
  //       <Tabs>
  //         <Tab label='Home'>
  //           <Recipes autoCompleteDataSource={ this.state.autoCompleteDataSource } tiles={ this.state.tiles } />
  //         </Tab>
  //         <Tab label='Create Recipe'>
  //           <CreateRecipe onSubmit={ this.handleSubmit } />
  //         </Tab>
  //       </Tabs>
  //     </Flexbox>
  //   );
  // }