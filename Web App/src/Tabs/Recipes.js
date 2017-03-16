import React from 'react'
import Flexbox from 'flexbox-react'

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import { GridList, GridTile } from 'material-ui/GridList'

import AutoComplete from 'material-ui/AutoComplete'
import CircularProgress from 'material-ui/CircularProgress'

import { filter } from 'ramda'

class Recipes extends React.Component {
	constructor(props){
		super(props)
		this.state = this.propsConst(props)
	}

	propsConst = (props) => {
		return({
			autoCompleteDataSource: props.autoCompleteDataSource,
			tiles: props.tiles,
			filteredTiles: props.tiles,
		})
	}

	componentWillReceiveProps(nextProps){
		this.setState(this.propsConst(nextProps))
	}

	handleRequest = (value) => {
		if (value){
			const filteredTiles = filter( (entry) => entry.RecipeName.indexOf(value) !== -1 , this.state.tiles)
			this.setState({ filteredTiles: filteredTiles })
		}
	}

	render(){
		return (
			<Flexbox flexDirection='column'>
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
			    <Flexbox flexDirection='row' justifyContent='center' flexWrap='wrap' >
			    { this.state.filteredTiles.map( (tile, index) => (
			    	<Card key={ index } style={ { maxWidth: '300px', margin: '7px' } } >
				      	<CardHeader title={ tile.RecipeName } showExpandableButton={ true } />
				      	<CardMedia overlay={<CardTitle title={ tile.RecipeName } />} >
				      		 <img src={ tile.URL } alt='' />
				      	</CardMedia>
				      	<CardText expandable={ true }>
				      		<Flexbox flexDirection='column'>
				      			<Flexbox>
				      				<font size={ 4 }> Ingredients </font>
				      			</Flexbox>
				      			<Flexbox>
				      				<p> { tile.Ingredients } </p>
				      			</Flexbox>
				      		</Flexbox>
						    </CardText>
						    <CardText expandable={ true }>
				      		<Flexbox flexDirection='column'>
				      			<Flexbox>
				      				<font size={ 4 }> Directions </font>
				      			</Flexbox>
				      			<Flexbox>
				      				<p> { tile.Directions } </p>
				      			</Flexbox>
				      		</Flexbox>
						    </CardText>
				      </Card>
			      ))}
			    </Flexbox>
        </Flexbox>
		)
	}
}

Recipes.propTypes = {
	autoCompleteDataSource: React.PropTypes.array,
	tiles: React.PropTypes.array,
}

export default Recipes