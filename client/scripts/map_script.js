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
        	zoom: 14
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
			  
            		infoWindow.open(map);
            		map.setCenter(pos);
			
                    var marker = new MarkerWithLabel({
                    //icon:icon,// "http://maps.google.com/mapfiles/kml/pal2/icon31.png",   
                    position: new google.maps.LatLng(pos.lat, pos.lng),
                    map: map,
                    labelContent: "your location" ,
                    labelAnchor: new google.maps.Point(30, 0),
                    labelClass: "tag",
                  });

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
*/		
var icon = {
    url: "../assets/images/hos.png", // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(15, 30) // anchor
};

/*	 var marker = new google.maps.Marker({
	          position: myLatLng,
			//icon: icon,
	          map: map,
		// label: labels,
	          title: 'Hello World!'
        });
	
*/
    var marker = new MarkerWithLabel({
	icon: icon, //"http://maps.google.com/mapfiles/kml/pal2/icon31.png",	
	position: new google.maps.LatLng((place.latitude).substr(0,7), (place.longitude).substr(0,7)),
	map: map,
	labelContent: place.hospiname ,
	labelAnchor: new google.maps.Point(30, 0),
	labelClass: "tag",
    });

    //  on clicking marker
   google.maps.event.addListener(marker, "click", function() {
    //showInfo(marker);
    

        
    // making unordred list using function htmlInfo Window 
    var ul = htmlInfoWindow(place);
        
    // show news
    showInfomarker(marker, ul);
        
        
    
    });



   showInfo(place);
    
   // google.maps.event.addListner(marker,"click",function(){loadinfo(marker,place)});
    Markers.push(marker);
    
}

function showInfomarker(marker, content)
{
    // start div
    var div = "<div>";
    if (typeof(content) === "undefined")
    {
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='../assets/images/ajax-loader.gif'/>";
    }
    else
    {
        div += content;
    }

    // end div
    div += "</div>";

    // set info window's content
    infoWindow.setContent(div);

    // open info window (if not already open)
    infoWindow.open(map, marker);
}

function htmlInfoWindow(place)
{
    // start a unordered list
    var ul = "<ul>";
    // create a template
   // var temp = _.template("<li> <a href = '<%- link %>' target= '_blank'><%- title %></a></li>");
    
    // inserting link and title into template
   /* for(var i=0, n = data.length;i<n;i++)
    {
        ul+=temp({
            link:data[i].link,
            title:data[i].title
            
        });
    }*/
    ul+="<li>" + place.hospiname + "</li>";
    ul+="<li>" + place.address + "</li>";
    ul+="<li>" + place.tel + "</li>";

    // ending unordered list
    ul += "</ul>";
    return ul;
}


/**
 * Configures application.
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
	//removediv();
        update();
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
	//removediv();
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
	
    for(var i=0;i<Markers.length;i++)
    {
        Markers[i].setMap(null);
    }
    Markers.length = 0;
removediv();
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

     // remove old markers from map
       // removeMarkers();  
    // remove div elements
    

        var obj = {
            NE:{
            lat: ne.lat(),
            lng: ne.lng()
            },
            SW:{
            lat: sw.lat(),
            lng: sw.lng()
            }
        }
        console.log(obj.NE);
        console.log(obj.SW);
        var objString = JSON.stringify(obj);
       $.post('http://localhost:4000', obj)
        .done(function(data){
            console.log(Object.keys(data).length);
            for (var i = 0; i < Object.keys(data).length; i++)
            {
                addMarker(data[i]);
                console.log(data[i].longitude+" "+data[i].latitude);
            }
        //    console.log(data[1].longitude+" "+data[1].latitude);
        });
       // removediv();
       

	
       /*  add new markers to map
        for (var i = 0; i < 3; i++)
        {
            addMarker(data);
        }
     
     /*.fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });*/
	//removediv();
}

function showInfo(place)
{
var div = "";//="<section id='sidebar'> ";
div+= "<div id='pj' class='details'>";
div+= "<p>"+ place.hospiname +"</p>";
div+= "<p>"+ (place.latitude) +"</p>";
div+= "<p>"+ place.longitude + "</p>" ;

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
