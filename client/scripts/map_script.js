/* global google */
/* global _ */
/**
 *
 * Global JavaScript.
 */

// Google Map
var map;

// markers for map
var Markers = [];

// info window
var infoWindow ;

function initMap() 
{
	var styles = [
        // hide Google's labels
        {
            featureType: "all",
            elementType: "labels",
            stylers: [
                {visibility: "off"}
            ]
        },

        // hide roads
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {visibility: "off"}
            ]
        }
    ];  
	map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15
        });

        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            infoWindow.setContent('Location has found.');
            infoWindow.open(map);
            
          },
        function() {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      }
    else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
        var obj = {
            NE:{
            lat: -34.397,
            lng: 150.644
            },
            SW:{
            lat:37.4236,
            lng:-122.1619
            }
        }
        var objString = JSON.stringify(obj);
       $.post('http://localhost:4000', obj)
        .done(function(data){
           var pos = {
              lat: parseInt(data[1].latitude),
              lng: parseInt(data[1].longitude)
            };
           map.setCenter(pos);
           infoWindow.setPosition(pos);
            console.log(data[1].longitude+" "+data[1].latitude);
        });
      }

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);

    // options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
/*
    var options = {
        center: {lat: 37.4236, lng: -122.1619}, // Stanford, California
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 14,
        panControl: true,
        styles: styles,
        zoom: 13,
        zoomControl: true
    };*/

    // get DOM node in which map will be instantiated
   // var canvas = $("#map-canvas").get(0);

    // instantiate map
   // map = new google.maps.Map(canvas, options);

    // configure UI once Google Map is idle (i.e., loaded)
  // google.maps.event.addListenerOnce(map, "idle", configure);

}  




/**
 * Configures application.
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
        update();
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
        update();
    });

    // remove markers whilst dragging
    google.maps.event.addListener(map, "dragstart", function() {
        removeMarkers();
    });


    // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
    // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
    document.addEventListener("contextmenu", function(event) {
        event.returnValue = true; 
        event.stopPropagation && event.stopPropagation(); 
        event.cancelBubble && event.cancelBubble();
    }, true);

    // update UI
    update();

   
}







/**
 * Updates UI's markers.
 */
function update() 
{
    // get map's bounds
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // get places within bounds (asynchronously)
  /*  var parameters = {
        ne: ne.lat() + "," + ne.lng(),
        q: $("#q").val(),
        sw: sw.lat() + "," + sw.lng()
    };
 //   $.getJSON("update.js", parameters)
   // .done(function(data, textStatus, jqXHR)*/

    
    
//		var sql1 = "SELECT * FROM ambivan";
//
//		con.query(sql1,function(err,result,fields) {
//		if(err) throw console.log(err.toString());
//		var jsonPretty = JSON.stringify(result,null,2);  
//		console.log("Result: " +jasonPretty);
//		});
		
	
/*
        // remove old markers from map
        removeMarkers();

        // add new markers to map
        for (var i = 0; i < data.length; i++)
        {
            addMarker(data[i]);
        }
     });
     .fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });*/
}

