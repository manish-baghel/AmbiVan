/**
 * Created by manish on 6/9/17.
 */
var database = require('../Models/db_model');
var firebase = require('firebase');
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDWhs_RWjp5s9VREGYo9jgtGFE8qXI7zKY',
  Promise:Promise
});
var promise = require('promise');

module.exports = {
    home:home,
    getAmbulance:getAmbulance,
    about:about,
    paramedic:paramedic,
    responder:responder,
    vision:vision,
    awareness:awareness,
    driver:driver,
    bookoverview:bookoverview,
    auth:auth,
    ambulancePost:ambulancePost,
    postform:postform,
    listvan:listvan,
    formresponder:formresponder,
    formdriver:formdriver,
    formparamedic:formparamedic,
    availability:availability,
    faq:faq,
    test:test,
    near:near

}

//==============================================
//============== GET REQUEST ===================
//==============================================

function home(req,res){
    res.render('index');
}
function getAmbulance(req, res){
    res.render("ambulance/getAmbulance");
}

function about(req,res){
    res.render('about/about.ejs');
}
function paramedic(req,res){
    res.render('paramedic/paramedic.ejs');
}
function responder(req,res)
{
    res.render('responder/responder.ejs');
}
function vision(req,res){
    res.render('vision/vision.ejs');
}
function awareness(req,res){
    res.render('awareness/awareness.ejs');
}
function faq(req,res){
    res.render('faq/faq.ejs');
}
function availability(req,res){
    res.render('availability/availability.ejs');
}
function driver(req,res){
    res.render('driverTraining/driverTraining.ejs');
}
function bookoverview(req,res){
    res.render('random/random.ejs');
}
function auth(req,res){
    res.render('auth.ejs');
}


//================================================
//=============== POST REQUEST ===================
//================================================

function ambulancePost(req, res){
    var data = req.body;
    if(data.signal == 0)
    {
    var query = makeQuery(data);
    var out = database.getDataFromTable(
         query,
        function(err,result){
            if(err) throw err;
            result = parseIt(result);
      //      console.log(result);
           return res.json(result);
        }
    );
    }
    else
    {
        var query = " Select * from ambivan";
     //   console.log(query);
        var out = database.getDataFromTable(
         query,
        function(err,result){
            if(err) throw err;
            result = parseIt(result);
       //     console.log(result);
           return res.json(result);
        }
    );
    }
}

var number
function listvan(req,res){
    console.log("here at listvan");
    var query = 'SELECT * from ambulance';
    var out = database.getDataFromTable(query, function(err,result){
        if(err) throw err;
        result = parseIt(result);
        console.log(result);
        return res.json(result);
    });

    // firebase.database()
    // .ref('/Driver_Vehicle_Location')
    // .once('value')
    // .then(function(snapshot){
    //     driver = snapshot.val();
    //     number = Object.keys(user).length;
    //     // console.log("1/2");
    //     // console.log(num+"--");
    //     // distance();
    //      res.json(driver);
    //     })

}


function postform(req,res,next){
    var query = 'Insert INTO `form` (`name` , `email` , `phone` , `message`) VALUES(' +'\''+req.body.contact_name+'\''+','+'\''+req.body.contact_email+'\''+','+'\''+req.body.contact_message+'\''+')';
   // console.log(query);
    // var out = database.getDataFromTable(query,function(err,result){
    //     if(err) throw err;
    //     else
    //     {
    //         console.log("form submitted");
    //         res.redirect('/');
    //     }
    // });
    res.redirect('/');
}

function formresponder(req,res,next){
    // var query = 'Insert INTO `form` (`name` , `email` , `phone` , `message`) VALUES(' +'\''+req.body.contact_name+'\''+','+'\''+req.body.contact_email+'\''+','+'\''+req.contact_body.message+'\''+')';
    console.log(req.body);
   res.redirect('/responder');
}

function formdriver(req,res,next){
    console.log(req.body);
    res.redirect('/driverTraining');
}

function formparamedic(req,res,next){
    console.log(req.body);
    res.redirect('/paramedic');
}

function test(req,res,next){
    console.log(req.body);
    res.send({string:"Partaay!!!!"});
}

var user="sunil";
var resp;
var str;
var sender;
var value=10000000;
var num;
function near(req,res,next){
console.log("0");
    value =1000000000000;
    sender =null;
    var data = req.body;
    console.log(data);
    str = data.LatLng;
    resp = res;
    var database = firebase.database();
    var read = promise.denodeify(readuserdata);
    var dist = promise.denodeify(distance);
    var lat = 28.542109;
    var lng = 77.1924421;
    var p =read()
        
        

   
    
}
function expectOK(response) {
    expect(response.status).toBe(200);
    expect(response.json.status).toBe('OK');
    return response;
}

function distance(){

    for(var key in user)
    {
       handler(key);
    }
    
}

function handler(key)
{
     googleMapsClient.distanceMatrix({
          origins : str,
          destinations: user[key].latitude+','+user[key].longitude,
          mode: 'driving',
          avoid: ['tolls']
        })
        .asPromise()
        .then(function(res,err) {
           
            console.log(res.json.rows[0].elements[0]);
           console.log("2"+key);
            
            user[key].vehicleId = res.json.rows[0].elements[0].distance.value;
            if(value > user[key].vehicleId)
            {
                value =user[key].vehicleId;
                sender = user[key];
            }
            num--;
            if(num==0)
            {
                console.log(sender+"  this is send");
                resp.send(sender);
            }
              
            // console.log(user);
        })
}

function readuserdata() {
    firebase.database()
    .ref('/Driver_Vehicle_Location')
    .once('value')
    .then(function(snapshot){
        user = snapshot.val();
        num = Object.keys(user).length;
        console.log("1/2");
        console.log(num+"--");
        distance();
         
        })
    .catch((err) => {console.log(err)});
}

function makeQuery(data){
    var sw_lat = data.SW.lat;
    var ne_lat = data.NE.lat;
    var sw_lng = data.SW.lng;
    var ne_lng = data.NE.lng;
    console.log(sw_lng+ne_lng);
    var query ;//= "SELECT * FROM ambivan";
    if (sw_lng <= ne_lng)
    {
        // doesn't cross the antimeridian
        query = 'SELECT * FROM places WHERE '+sw_lat+' <= latitude AND latitude <= '+ne_lat+' AND ('+sw_lng+' <= longitude AND longitude <= '+ne_lng+')';
    }
    else
    {
        // crosses the antimeridian
        query = 'SELECT * FROM places WHERE '+sw_lat+' <= latitude AND latitude <= '+ne_lat+' AND ('+sw_lng+' <= longitude OR longitude <= '+ne_lng+')';
    }
    //console.log(query);
    return query;
}
function parseIt(rawData){
    rawData = JSON.stringify(rawData);
    rawData = JSON.parse(rawData);
    return rawData;
}
