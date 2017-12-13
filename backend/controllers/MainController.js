/**
 * Created by manish on 6/9/17.
 */
var database = require('../Models/db_model');

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
    formparamedic:formparamedic

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

function listvan(req,res){
    console.log("here at listvan");
    var query = 'SELECT * from ambulance';
    var out = database.getDataFromTable(query, function(err,result){
        if(err) throw err;
        result = parseIt(result);
        return res.json(result);
    });
}


function postform(req,res,next){
    var query = 'Insert INTO `form` (`name` , `email` , `phone` , `message`) VALUES(' +'\''+req.body.contact_name+'\''+','+'\''+req.body.contact_email+'\''+','+'\''+req.contact_body.message+'\''+')';
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
