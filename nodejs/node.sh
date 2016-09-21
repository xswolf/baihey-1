WEB_DIR='/alidata/www/baihey'
WEB_APP='nodejs/app.js'

#location of node you want to use
NODE_EXE=/usr/local/bin/node

while true; do
    {
        $NODE_EXE $WEB_DIR/$WEB_APP
        echo $NODE_EXE
	echo $WEB_DIR/$WEB_APP
	echo "Stopped unexpected, restarting \r\n\r\n"
    } 2>> $WEB_DIR/error.log
    sleep 1
done
