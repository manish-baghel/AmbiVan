var mysql      = require('mysql');
var connection = mysql.createConnection({
host     : 'localhost',
user     : 'root',
password : 'PASSWORD',
database : 'ambuCenter'
});


module.exports = {
    getNameFromTable: function(query,callback)
    {
        connection.connect();
        connection.query(query, 
            function(err,result,fields) {
                if (err) return callback(err, null);
                return callback(null, result);
            }
        ); 
        connection.end();
    },
}
