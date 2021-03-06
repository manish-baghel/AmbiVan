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
var ambulan = new Array();
// info window
var infoWindow ;

// number of marker to be placed
var num;

var pos;

//====================================================================================
//===================== Inintialize map =============================================
//===================== Sunil Kumar     =============================================
//====================================================================================
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
    // find geo location
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

            //=====================================================================
            //============= GET ALL THE DATA OF DISTANCE OF HOSPITALS =============
            //=====================================================================
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
         ambu();
    	handleLocationError(false, infoWindow, map.getCenter());
    }
    getvan();

    //directionsDisplay.setPanel(document.getElementById('dvPanel'));
	// configure UI once Google Map is idle (i.e., loaded)
	google.maps.event.addListenerOnce(map, "idle", configure);

}

//=========================================================================
//========= IF GEOLOCATION OF BROWSER DON'T WORKS SHOW THIS MESSAGE =======
//=========================================================================
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}  

//==========================================================================
//=============== FUCTION FOR GETING LOCATION OF AMBULANCES ================
//=============== CHECKS EVERY 2SEC   ======================================
//==========================================================================
function checker()
{
    $.post('http://localhost:4000/van')
    .done(function(data){
        num = Object.keys(data).length;
        for(var key in data)
        {
            // function for adding marker of ambulances
            if(data[key].latitude!=ambulan['\''+data[key].vehicleId+'\''].position.lat()||data[key].longitude!=ambulan['\''+data[key].vehicleId+'\''].position.lng())
            {
                // updates location on maps so that markesrs move
               updater(data[key]);
            }
        }
    })
    setTimeout(checker,2000);
}



//=============================================================================
//=========== FUNCTION FOR UPDATING MARKERS LOCATION =========================
//============================================================================
function updater(van)
{
    
    var id = van.vehicleId;
    var numDeltas = 200;
    var delay = 20; //milliseconds
    var i = 0;
    var deltaLat;
    var deltaLng;
    var val = ambulan['\''+id+'\''].position.lat();
    var val1 = ambulan['\''+id+'\''].position.lng()
    var lat = van.latitude;
    var lng = van.longitude;
    deltaLat = (lat-val)/numDeltas;
    deltaLng = (lng-val1)/numDeltas;
    // console.log(lat+" "+val+" "+lng+" "+val1+" "+id);
    // console.log(ambulan);
    (function myloop(i){
        setTimeout(function(){
            val+=deltaLat;
            val1+=deltaLng;
            ambulan['\''+id+'\''].setPosition(new google.maps.LatLng(val,val1));
            if(--i)
                myloop(i);
        },10);
    })(100);

    var origin1 = new google.maps.LatLng(pos.lat,pos.lng);
    var destination = new google.maps.LatLng(van.latitude,van.longitude);
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
            if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS")
            {
                var distance = response.rows[0].elements[0].distance.text;
                var duration = response.rows[0].elements[0].duration.text;
                    // = distance;
                    // console.log(distance);
                distance = distance.substring(0,distance.length-3);
                //console.log(distance);
                distance = parseFloat(distance);
                van.distance = distance;
                google.maps.event.addListener(ambulan['\''+id+'\''], "click", function(){  
                    // making unordred list using function htmlInfo Window 
                    var ul = htmlInfoWindowambu(van);
                    // show news
                    showInfomarker(ambulan['\''+id+'\''], ul);
                });
            }
    }
    );
   // moveMarker();
    // function moveMarker(){
    //     Markers[id].position[0] += deltaLat;
    //     Markers[id].position[1] += deltaLng;
    //     var latlng = new google.maps.LatLng(Markers[id].position[0], Markers[id].position[1]);
    //     Markers[id].setPosition(latlng);
    //     if(i!=numDeltas){
    //         i++;
    //         setTimeout(moveMarker, delay);
    //     }
    // }

    //    setTimeout(function() {Markers[id].setPosition(new google.maps.LatLng(28.5450+i/100,77.1926+i/1000));}, 10000);
    
}

//=====================================================================================
//================= ADDS LOCATION MARKER OF HOSPITALS TO MAP ==========================
//=====================================================================================

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
//=============================================================
//============ MARKER OF HOSPIATLS ============================
//==============================================================
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
   google.maps.event.addListener(marker, "click", function(){
        //showInfo(marker);

       //     source = //document.getElementById("txtSource").value;
       // destination = //document.getElementById("txtDestination").value;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': false ,'preserveViewport': true,'suppressMarkers': true });
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


//=======================================================================
//=========== Listing of hospitals on right section  ===================
//=========== of screen after calculating there distance ================
//=======================================================================
function htmlInfoWindow(place)
{
    // start a unordered list
    var ul = "<ul>";
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
 * controls flows of command and 
 * running given function on specifc events
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
        update();
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
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

//=================================================================
//======= Removes hospitals marker on dragging of graph ===========
//================== And also zoom changes ========================
//=================================================================
function removeMarkers()
{
	
    for(var i=0;i<Markers.length;i++)
    {
        Markers[i].setMap(null);
    }
    Markers.length = 0;
    removediv();
}

//============================================================================
//======== Add markers of all the ambulances for first time =================
//==============  Called form mapinit =======================================
//=======================================================================
function getvan()
{
    $.post('http://localhost:4000/van')
    .done(function(data){
        num = Object.keys(data).length;
        for(var key in data)
        {
            // function for adding marker of ambulances
            addMarker1(data[key]);
        }
    })
   checker();
}
//=====================================================================
//========== addes amubulance markers =================================
//=====================================================================
function addMarker1(place)
{

    var icon = {
        url: "../assets/images/ambu.png", // url
        scaledSize: new google.maps.Size(40, 40), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(15, 30) // anchor
    };

    var marker = new MarkerWithLabel({
        icon: icon,
        position: new google.maps.LatLng(place.latitude,place.longitude),
        map: map
    });

    google.maps.event.addListener(marker, "click", function(){
        //showInfo(marker);

       //     source = //document.getElementById("txtSource").value;
       // destination = //document.getElementById("txtDestination").value;
       var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': false ,'preserveViewport': true,'suppressMarkers': true});
        // directionsDisplay.setMap(null);
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
        var ul = htmlInfoWindowambu(place);
            
        numi =1;
        // show news
        showInfomarker(marker, ul);
        
            
    });
    // adds marker of driver on map
    // showInfo(marker);
    // console.log(place);
    ambulan['\''+place.vehicleId+'\''] = marker;
}

function htmlInfoWindowambu(place)
{
    // start a unordered list
    var ul = "<ul>";
    ul+="<li>" + place.vehicleId+ "</li>";
    // ul+="<li>" + place.phone + "</li>";
    // ul+="<li>" + place.address + "</li>";
    ul+="<li>" + place.distance + " KM</li>";

    // ending unordered list
    ul += "</ul>";
    return ul;
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
    //    console.log(obj.NE);
    //    console.log(obj.SW);
        var arry = [];
        var objString = JSON.stringify(obj);
       $.post('http://localhost:4000/ambulance', obj)
        .done(function(data){
    //        console.log(Object.keys(data).length);
            //var p = Object.keys(data).length;
            num = Object.keys(data).length;
            for (var i = 0; i < Object.keys(data).length; i++)
            {
               
                //console.log(data[i]);
                var po = data;
                var origin1 = new google.maps.LatLng(pos.lat,pos.lng);
                var destination = new google.maps.LatLng(data[i].latitude,data[i].longitude);
                getDistance(origin1,destination,i,data,num);
            }
            
        });
}


//=============================================================================
//============= Calculates distance of markers  ===============================
//============ from given origin and destinations==============================
//=============================================================================
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
//    console.log(i+"yo");
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
      //  updater(0);
    }
}
//============================================================================
//============= List ambulances in side section ===============================
//===========================================================================
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
    // $.post('http://localhost:4000/ambulist')
    // .done(function(data)
    // {
    //     for (var key in data)
    //     {
    //         showInfoambu1(data[key]);
    //     }
    // });

}

//========= List the data of ambulace from sql in left section=========================
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
div+= "<button class='book-btn btn mx-auto'>Book</button>"

div+="</div>";
//div+="</section>";
document.getElementById('ambuContent').innerHTML+=div;

}

//===================== List ambulances from firebase in left section ============
function showInfoambu1(place)
{
    var div = "";//="<section id='sidebar'> ";
    div+= "<div  class='details'>";

    div+= "<p class='name'>"+ place.vehicleId +"</p>";
    div+= "<a class= 'phone' href=tel:"+place.phone+">"+ 8130200210 +"</a>";
    /*
    div+= "<p><a href =http://"+ place.website + ">"+place.website+"</a></p>" ;
    div+= "<p>"+ place.distance + " KM</p>";
    */
    // div+= "<p>" + place.address + "</p>"

    div+="</div>";
    //div+="</section>";
    document.getElementById('side').innerHTML+=div;

}


//=========================================================================
// ===============  LIST DATA OF HOSPITALS ===============================
//=========================================================================
function showInfo(place)
{
    var div = "";//="<section id='sidebar'> ";
    div+= "<div id='pj' class='details'>";

    div+= "<p class='hospiname'>"+ place.hospiname +"</p>";
    div+= "<a class='phone' href=tel:"+place.phone+">"+place.phone+"</a>";
    div+= "<p><a class='website' target='_blank' href =http://"+place.website+">Website</a></p>";
    div+= "<p class='distance'>"+ place.distance + " KM</p>";


    div+="</div>";
    //div+="</section>";
    document.getElementById('hospiContent').innerHTML+=div;
}

//=======================================================================
//================= REMOVE DIV ELEMENTS OF HOSPITALS ====================
//================= WHEN MARKERS ARE RELOADED DUE =======================
//================= TO DRAGGING OR ZOOM CHANGE ==========================
//=======================================================================
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
        // console.log(i+"yo");
        data[i].distance = distance;
       
        }
        else
        {
            // alert("Unable to find the distance via road.");
        }   
}