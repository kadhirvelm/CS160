import React from 'react'
import Flexbox from 'flexbox-react'

import {GridList, GridTile} from 'material-ui/GridList'
import AutoComplete from 'material-ui/AutoComplete'
import CircularProgress from 'material-ui/CircularProgress'

class Recipes extends React.Component {
	constructor(props){
		super(props)
		this.state = this.propsConst(props)
	}

	propsConst = (props) => {
		return({
			autoCompleteDataSource: props.autoCompleteDataSource,
			tiles: props.tiles,
		})
	}

	componentWillReceiveProps(nextProps){
		this.setState(this.propsConst(nextProps))
	}

	render(){
		return (
			<Flexbox>
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
        </Flexbox>
		)
	}
}

Recipes.propTypes = {
	autoCompleteDataSource: React.PropTypes.array,
	tiles: React.PropTypes.array,
}

export default Recipes