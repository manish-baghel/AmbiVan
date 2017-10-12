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

// number of marker to be placed
var num;

var pos;

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
		center: {lat: 28.5450, lng: 77.1926},
		styles: styles,
        	zoom: 14,
            gestureHandling: 'greedy'
    	}

    // get DOM node in which map will be instantiated
    var canvas = $("#map").get(0);

        // instantiate map
        map = new google.maps.Map(canvas,options);
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.

        if (navigator.geolocation) 
	   {
        	navigator.geolocation.getCurrentPosition(function(position)
		      {
            		 pos = {
              			//lat: data.latitude,
				lat: position.coords.latitude,
              			lng: position.coords.longitude
				//lng: data.longitude
            		};
                    getalldata();
                    ambu();
            		//infoWindow.open(map);
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


       //   
        //directionsDisplay.setPanel(document.getElementById('dvPanel'));
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

   //     source = //document.getElementById("txtSource").value;
   // destination = //document.getElementById("txtDestination").value;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
    directionsDisplay.setMap(null);
    directionsDisplay.setMap(map);
    var source = new google.maps.LatLng(pos.lat,pos.lng);
    var destination = new google.maps.LatLng(place.latitude,place.longitude);
                

    var request = {
        origin: source,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
 


        
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
    ul+="<li>" + place.phone + "</li>";
    ul+="<li>" + place.address + "</li>";
    ul+="<li>" + place.distance + " KM</li>";

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
        removeMarkers();
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
        event.cancelBubble;
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

        removeMarkers();  
    // remove div elements
    

        var obj = {
            signal:0,
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
        var arry = [];
        var objString = JSON.stringify(obj);
       $.post('http://localhost:4000/ambulance', obj)
        .done(function(data){
            console.log(Object.keys(data).length);
            //var p = Object.keys(data).length;
            num = Object.keys(data).length;
            for (var i = 0; i < Object.keys(data).length; i++)
            {
               
             //   console.log(data[i]);
                var po = data;
                var origin1 = new google.maps.LatLng(pos.lat,pos.lng);
                var destination = new google.maps.LatLng(data[i].latitude,data[i].longitude);
                

                getDistance(origin1,destination,i,data,num);
                

            }
            
        });
}
function callba(response,status,i,data,ni)
{
    if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
    var distance = response.rows[0].elements[0].distance.text;
    var duration = response.rows[0].elements[0].duration.text;
        // = distance;
        // console.log(distance);
    distance = distance.substring(0,distance.length-3);
    //console.log(distance);
    distance = parseFloat(distance);
    console.log(i+"yo");
    data[i].distance = distance;
 
    }
    else
    {
//         alert("Unable to find the distance via road.");
    }
    removeMarkers();
    if(i == ni-1)
    {
        data.sort(function(a,b){
            return a.distance-b.distance; 
        });
        for(var j=0;j<=i;j++)
        {
            addMarker(data[j]);
        }
    }
}

function getDistance(origin1,destination,i,data,ni){
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [origin1],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) 
    {
        callba(response,status,i,data,ni);
    }
    );
    
}

function ambu()
{
    var obj = {
        signal: 1
    }
    $.post('http://localhost:4000/ambulance', obj)
        .done(function(data)
        {
            for (var i = 0; i < Object.keys(data).length; i++)
            {
                showInfoambu(data[i]);
            }
        });
}


function showInfoambu(place)
{
var div = "";//="<section id='sidebar'> ";
div+= "<div  class='details'>";

div+= "<p class='name'>"+ place.name +"</p>";
div+= "<a class= 'phone' href=tel:"+place.phone+">"+ place.phone +"</a>";
/*
div+= "<p><a href =http://"+ place.website + ">"+place.website+"</a></p>" ;
div+= "<p>"+ place.distance + " KM</p>";
*/
div+= "<p>" + place.address + "</p>"

div+="</div>";
//div+="</section>";
document.getElementById('side').innerHTML+=div;

}



function showInfo(place)
{
var div = "";//="<section id='sidebar'> ";
div+= "<div id='pj' class='details'>";

div+= "<p class='hospiname'>"+ place.hospiname +"</p>";
div+= "<a class='phone' href=tel:"+place.phone+">"+place.phone+"</a>";
div+= "<p><a class='website' href =http://"+place.website+">Website</a></p>";
div+= "<p class='distance'>"+ place.distance + " KM</p>";


div+="</div>";
//div+="</section>";
document.getElementById('sidebar').innerHTML+=div;

}


function removediv() {
var elem = document.getElementById('pj');
while(elem!=null){
  
 elem.parentNode.removeChild(elem);
 elem = document.getElementById('pj');
}

}


function getalldata()
{

     var obj = {
            NE:{
            lat: 28.757072588741632,
            lng: 77.7459763295899
            },
            SW:{
            lat: 28.362046667250237,
            lng: 76.67137610986333
            }
        }
        console.log(obj.NE);
        console.log(obj.SW);
        var arry = [];
        var objString = JSON.stringify(obj);
       $.post('http://localhost:4000/ambulance', obj)
        .done(function(data){
            console.log(Object.keys(data).length);
            //var p = Object.keys(data).length;
            num = Object.keys(data).length;
            for (var i = 0; i < Object.keys(data).length; i++)
            {
               
             //   console.log(data[i]);
                var po = data;
                var origin1 = new google.maps.LatLng(pos.lat,pos.lng);
                var destination = new google.maps.LatLng(data[i].latitude,data[i].longitude);
                

                getDistance1(origin1,destination,i,data);
                

            }
            
            
        });
}


function getDistance1(origin1,destination,i,data){
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [origin1],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) 
    {
        callba1(response,status,i,data);
    }
    );
    
}
function callba1(response,status,i,data)
{
     if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
        var distance = response.rows[0].elements[0].distance.text;
        var duration = response.rows[0].elements[0].duration.text;
         
        distance = distance.substring(0,distance.length-3);
        //console.log(distance);
        distance = parseFloat(distance);
        console.log(i+"yo");
        data[i].distance = distance;
       
        }
        else
        {
            // alert("Unable to find the distance via road.");
        }   
}