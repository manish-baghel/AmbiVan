/**
 * Created by manish on 6/9/17.
 */
var database = require('../Models/db_model');

module.exports = {
    home:home,
    homePost:homePost
}
function home(req, res){
    res.render('index');
}

function homePost(req, res){
    var data = req.body;
    var query = makeQuery(data);
    var out = database.getDataFromTable(
        query,
        function(err,result){
            if(err) throw err;
            result = parseIt(result);
            console.log(result);
           return res.json(result);
        }
    );
}
function makeQuery(data){
    var sw_lat = data.SW.lat;
    var ne_lat = data.NE.lat;
    var sw_lng = data.SW.lng;
    var ne_lng = data.NE.lng;
    console.log(sw_lat+ne_lat);
    var query = "SELECT * FROM ambivan";
    return query;
}
function parseIt(rawData){
    rawData = JSON.stringify(rawData);
    rawData = JSON.parse(rawData);
    return rawData;
}
