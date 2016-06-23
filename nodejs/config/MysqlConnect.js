function MysqlConnect(){
        this.host = '120.76.84.162' ;
        this.user = 'jrbaihe' ;
        this.password = 'jrbh*2016' ;
        this.database = 'bhy';

        this.connection = function () {
                var mysql = require('mysql') ;
                var conn  = mysql.createConnection({
                        host : this.host,
                        user : this.user ,
                        password : this.password ,
                        database : this.database
                });
                return conn;
        }
}

module.exports = MysqlConnect;
