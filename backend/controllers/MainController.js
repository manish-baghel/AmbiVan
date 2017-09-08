/**
 * Created by manish on 6/9/17.
 */
var data = require('../Models/db_model');

module.exports = {
    home:home,
    data:"hello"
}
data.getNameFromTable(
    "SELECT * FROM customers",
    function(err,result){
        if(err) throw err;
        console.log(parseIt(result));
    });
function home(req, res) {
    res.render('index', {});
}
function parseIt(rawData){
    rawData = JSON.stringify(rawData);
    rawData = JSON.parse(rawData);
    return rawData;
}