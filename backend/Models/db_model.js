var mysql      = require('mysql');
var connection = mysql.createConnection({
host     : 'ambivandb.clgxnt8wiied.us-east-2.rds.amazonaws.com',
port     : 3306,
user     : 'master',
password : 'nodejs123',
database : 'ambivan'
});


module.exports = {
    getDataFromTable: function(query,callback)
    {
        connection.query(query, 
            function(err,result,fields){
                if (err) return callback(err, null);
                return callback(null, result);
            }
        );  
    },
}
