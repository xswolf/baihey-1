
function Message() {
    var Mysql = require('../config/MysqlConnect');
    var mysql = new Mysql();

    // 发送信息记录数据库
    this.add = function (msg, callback) {
        var sql = 'insert into bhy_user_message (send_user_id , receive_user_id,message,message_type,create_time,status) values(?,?,?,?,?,?)';
        var time = Date.parse(new Date()) / 1000;
        //var sql = 'insert into bhy_message set send_user_id = ? ,receive_user_id=?, message=?,message_type=?,create_time=?,status=?';
        var conn = mysql.connection();
        conn.query(sql , [msg.send_user_id,msg.receive_user_id,msg.message,this.getMessageType(msg.type),time,msg.status] , function (err ,res) {
            if(err) {
                conn.end();
                console.error(err);
                return;
            }
            callback(err, res);
        })
        conn.end();
    }

    // 获取消息类型
    this.getMessageType = function(send){
        var type = null;
        if (send ==  'send'){
            type = 1;
        }else if(send ==  'record'){
            type = 2;
        }else if (send ==  'pic'){
            type = 3;
        }else if (send ==  'bribery'){
            type = 4;
        }
        return type;
    }
}

module.exports = Message;