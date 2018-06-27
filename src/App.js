import React, { Component } from 'react';
import PlaceList from './PlaceList'
import './App.css';

class App extends Component {
    constructor(props) 
    {
      super(props)
      this.state ={
      markers: require("./places.json"),
      map: "",
      infowindow:'',
      currentMarker:'',
      markersArray:[]
      }
      this.initMap = this.initMap.bind(this);
      this.createMarkers=this.createMarkers.bind(this);
      this.makeMarkerIcon=this.makeMarkerIcon.bind(this);
      this.openMarker=this.openMarker.bind(this);
      this.closeWindow=this.closeWindow.bind(this);
      this.getInfo=this.getInfo.bind(this);
    }
    componentDidMount() 
    {
        window.initMap = this.initMap;
        LoadMapJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyCG6THolKuCbFqZuAMiXDRGWVBkl8VsuiA&v=3&callback=initMap");
    }
initMap() {

    var self=this;
    var map=document.getElementById("map");
    var InfoWindow=new window.google.maps.InfoWindow({});
    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      self.closeWindow();
    });
    map.style.height="100vh";
    map = new window.google.maps.Map(map, {
          center: {lat: 11.0168445, lng: 76.95583209999995},
          zoom: 13,
          });
    //map.style.height=window.innerHeight+"px";
    this.setState({
      map:map,
      infowindow:InfoWindow
    })

    window.google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });
    //this.setState({currentMarker:this.state.currentMarker})
    //console.log(this.state.infowindow)
    window.google.maps.event.addListener(map, "click", function() {
      self.closeWindow();
    });
    this.createMarkers(map)
}

createMarkers(map) {

    let self=this;
    //var markers=[];
    //var bounds = new window.google.maps.LatLngBounds()
    var defaultIcon = self.makeMarkerIcon('0091ff');
    var highlightedIcon = self.makeMarkerIcon('FFFF24');
    this.state.markers.forEach(marker => {
            //const loc = {lat: marker.lat, lng: marker.long}

            let mark = new window.google.maps.Marker({
                position: marker.location,
                map: map,
                icon :defaultIcon,
                title: marker.title
            });


            mark.addListener('click', function () {
                self.openMarker(mark);
            });

            let virtMarker = this.state.markersArray;
            virtMarker.push(mark);

            this.setState({markersArray: virtMarker});

            mark.addListener("mouseover",function(){mark.setIcon(highlightedIcon)});
            mark.addListener("mouseout",function(){mark.setIcon(defaultIcon)});
        });
    //this.setState({markers:markers})
    //this.setState({currentMarker:markers})
    //console.log(this.state.currentMarker)

}
makeMarkerIcon(markerColor) 
{
    var markerImage = new window.google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new window.google.maps.Size(21, 34),
          new window.google.maps.Point(0, 0),
          new window.google.maps.Point(10, 34),
          new window.google.maps.Size(21,34));
    return markerImage;
}

openMarker(marker) {
  //let self=this;
  //console.log(marker)
  var clientId="EXYQCVBF2CDQX31NAPC0YZ1Y05LCW2YEVEIYYYUFZENZSPQF";
  var clientSecret="V3UTPALNGPLSWXDKX53B5GBOZWNT3WO5JYVJKXNXTBAU23VH";
  const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
  this.closeWindow();
  this.setState({currentMarker:marker});
  if(this.state.infowindow.marker!==marker) {
    //console.log("Inside if")
    //eslint-disable-next-line
    this.state.infowindow.marker=marker;
    this.state.infowindow.setContent("loading........");
    this.state.infowindow.open(this.state.map,marker);
    //console.log(this.state.currentMarker)
    this.getInfo(url);
  }
}

getInfo(url) {

  let self=this.state.infowindow;
  //let place;
  fetch(url)
    .then(function(res){
      if(res.status!==200)
      {
        const err ="Cant load data";
        this.state.info.setContent(err)
      }

      res.json().then(function(data) {
        var place=data.response.venues[0];
        let phone='';

        if(place.contact.formattedPhone)
        {
          phone="<p><b>Phone:</b>"+place.contact.formattedPhone+"</p>"

        }
        var info=
          "<div id='marker'>" +
          "<h3>" + self.marker.title + "</h3>" +
          phone +
          "<p><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>" +
            "</div>";
            self.setContent(info)

      })
    })
    .catch(function(err) {
      const error="Cannot load data";
      self.setContent(error);
    })

}
closeWindow() {
  if(this.state.currentMarker)
  {
    //eslint-disable-next-line
    this.state.infowindow.marker=null;
    this.state.infowindow.close();
  }
  //console.log(this.state.currentMarker)
  this.setState({currentMarker:''});
  //console.log(this.state.currentMarker)
}
    render() {
      //console.log("Render")
    return (
      <div className="App">
      <PlaceList currentMarker={this.state.markersArray} infowindow={this.state.infowindow} openWindow={this.openMarker} closeWindow={this.closeWindow} />
      <div id="map"></div>
      </div>
    );
    }
}

export default App;

function LoadMapJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.defer = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}
