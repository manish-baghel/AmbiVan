var mysql      = require('mysql');
var connection = mysql.createConnection({
host     : process.env.RDS_HOSTNAME,
port     : process.env.RDS_PORT,
user     : process.env.RDS_USERNAME,
password : process.env.RDS_PASSWORD,
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
