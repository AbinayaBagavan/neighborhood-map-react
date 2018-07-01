import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import './App.css';

class PlaceList extends Component {
	constructor(props) {
		super(props)
		this.state={
			query:"",
			markers: [],
			infowindow:''
		}
		this.toggleMenu=this.toggleMenu.bind(this);
		this.searchQuery=this.searchQuery.bind(this);
	}

	componentDidMount() {
		this.setState({markers:this.props.currentMarker})
		//console.log(this.state.markers)
	}
	toggleMenu() 
	{
	//console.log("toggled")
	//console.log(this.props.currentMarker[0])
	document.getElementById("side-menu").classList.toggle("hidden");
	}
//filter results based on query entered
	searchQuery(event){
		this.props.closeWindow();
		//console.log(this.props.currentMarker[0])
		let query=event.target.value;
		this.setState({query:query.trim()})
		let markers=this.props.currentMarker;
		let newMark=[];
		if(query)
		{
		const match = new RegExp(escapeRegExp(query), 'i');
		markers.map((marker)=>{
			if(match.test(marker.title)){
				marker.setVisible(true);
				newMark.push(marker)
			}
			else
			{
				marker.setVisible(false);
			}
			return marker;
		})
		
		this.setState({markers:newMark})
		//console.log(this.state.markers[0].marker.getPosition().lat())
	}
	else {
		//console.log("NO query");
		for(var j=0;j<markers.length;j++)
		{
			markers[j].setVisible(true);
		}
		this.setState({markers:markers});
		//console.log(this.props.currentMarker)
	}
}
	render() {
		const {query}=this.state
		return (
			<div>
				<header>
				Coimbatore
				<div className="menu-icon" onClick={()=>this.toggleMenu()}>
					<div className="menu-line"/>
					<div className="menu-line"/>
					<div className="menu-line"/>
				</div>
				<div id="side-menu" className="side-menu hidden">
					<div id="filter-places" className="form" role="form">
						<input type="text"
						aria-labelledby="filter-places"
						placeholder="filter"
						className="search-bar"
						role="search"
						value={query}
            			onChange={this.searchQuery}
						/>
					</div>
					<ul>
					{
						this.state.markers && this.state.markers.length && this.state.markers.map((marker,i) =>
							<li key={i}>
							<a onClick={()=>this.props.openWindow(marker)} tabIndex="0" role="button">{marker.title}</a>
							</li>
						)
					}
					</ul>
				</div>
				</header>
			</div>
			)
	}
}

export default PlaceList 