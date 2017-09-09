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

var data = { id:"0", hospiname:"my hospiname",lng:77.3759,lat:28.5120};

function initMap() 
{

	var styles = [

        // hide Google's labels
        {
            featureType: "all",
            elementType: "labels",
            stylers: [
                {visibility: "on"}
            ]
        },

        // hide roads
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {visibility: "on"}
            ]
        }

    ];

      
	//map = new google.maps.Map(document.getElementById('map'),
	var options = 	
	{
		zoomControl: true,
		center: {lat: -34.397, lng: 150.644},
		styles: styles,
        	zoom: 9
    	}

        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) 
	{
        	navigator.geolocation.getCurrentPosition(function(position)
		{
            		var pos = {
              			//lat: data.latitude,
				lat: position.coords.latitude,
              			lng: position.coords.longitude
				//lng: data.longitude
            		};
			console.log(pos);
			
		//	data.latitude = pos.lat;
		//	data.longitude = pos.lng;

            		infoWindow.setPosition(pos);
            		infoWindow.setContent('Location has found.');
            		infoWindow.open(map);
            		map.setCenter(pos);
			//addMarker(data);
			addMarker(pos);
			addMarker(data);
          	}, function() {
            		handleLocationError(true, infoWindow, map.getCenter());
          	});
        } 
	else 
	{
          	// Browser doesn't support Geolocation
        	handleLocationError(false, infoWindow, map.getCenter());
        }
 	// get DOM node in which map will be instantiated
   	var canvas = $("#map").get(0);

    	// instantiate map
   		map = new google.maps.Map(canvas,options);

    	// configure UI once Google Map is idle (i.e., loaded)
  		google.maps.event.addListenerOnce(map, "idle", configure);

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}  

function addMarker(place)
{
    // creating marker
    
   /*var marker = new google.maps.Marker({
	icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",	
	position: new google.maps.LatLng(place.latitude, place.longitude),
	map: map,
	labelOrigin: (20,100),
	label: place.place_name + ", " + place.admin_name1 ,
	anchor: new google.maps.Point(200,100),
	
//	labelClass: "label"
    });*/
	/*	var labels = place.hospiname;
      var labelIndex = 0;
	var myLatLng = {lat: place.lat, lng: place.lng};
	console.log(myLatLng);
		
var icon = {
    url: "../assets/images/hos.png", // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(15, 30) // anchor
};

	 var marker = new google.maps.Marker({
	          position: myLatLng,
			//icon: icon,
	          map: map,
		// label: labels,
	          title: 'Hello World!'
        });
	
*/
    var marker = new MarkerWithLabel({
	//icon: "http://maps.google.com/mapfiles/kml/pal2/icon31.png",	
	position: new google.maps.LatLng(place.lat, place.lng),
	map: map,
	labelContent: place.hospiname ,
	labelAnchor: new google.maps.Point(30, 0),
	labelClass: "tag",
    });
   showInfo(place);
    
   // google.maps.event.addListner(marker,"click",function(){loadinfo(marker,place)});
    Markers.push(marker);
    
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

function removeMarkers()
{
	removediv();
    for(var i=0;i<Markers.length;i++)
    {
        Markers[i].setMap(null);
    }
    Markers.length = 0;
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
	 

/*		var sql1 = "SELECT * FROM ambivan";

		con.query(sql1,function(err,result,fields) {
		if(err) throw console.log(err.toString());
		var jsonPretty = JSON.stringify(result,null,2);  
		console.log("Result: " +jasonPretty);
		});
*/		
	// remove div elements
	//removediv();

//var data = { id:"0", hospiname:"my hospiname",longitude:-34.397,latitude:150.644};
        // remove old markers from map
       // removeMarkers();
	
        // add new markers to map
        for (var i = 0; i < 5; i++)
        {
            addMarker(data);
        }
     
     /*.fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });*/
}

function showInfo(place)
{
var div = "";//="<section id='sidebar'> ";
div+= "<div id='pj' class='details'>";
div+= "<p>"+ place.hospiname +"</p>";
div+= "<p>"+ place.lat +"</p>";
div+= "<p>"+ place.lng + "</p>" ;

div+="</div>";
//div+="</section>";
document.getElementById('sidebar').innerHTML+=div;

}


function removediv() {
var elem = document.getElementById('pj');
while(elem!=null){
  elem = document.getElementById('pj');
 elem.parentNode.removeChild(elem);}
}
