const express = require('express');
const cors = require('cors');
const shell = require('shelljs');
const ytdl = require('ytdl-core');
const isReachable = require('is-reachable');
const app = express();
const PORT = 4000;

var datestat = "14:00:00";
var activated = "False";

function date() {
	let uhr = new Date().toLocaleTimeString();
	if(datestat<="22:00:00"){
		if(uhr>="22:00:00"){
			if(activated=="False"){
				shell.exec(`sudo uhubctl -l 1-1 -a off 1>&-`);
				display();
        		shell.exec(`echo Usb aus`);
        		activated = "True";
			}
		}
	}
	setTimeout(date, 500);
}

date();

function display() {
	shell.exec("figlet Server Works");
}

app.use(cors());

app.listen(PORT, () => {
	display();
});

app.get('/button', async (req, res, next) => {	
	var status = req.query.stat;
	try{
		if(status=="usbon"){
			shell.exec("sudo uhubctl -l 1-1 -a on 1>&-");
			display();
			shell.exec(`echo "Usb an"`);
			datestat = new Date().toLocalTimeString();
			activated = "False";			
			return res.sendStatus(200);
		}else if(status=="usboff"){
			shell.exec("sudo uhubctl -l 1-1 -a off 1>&-");
			display();
			shell.exec(`echo Usb aus`);
			datestat = new Date().toLocaleTimeString();
			activated = "True";
			return res.sendStatus(200);
		}else if(status=="reboot"){
			shell.exec("sudo apt update && sudo apt full-upgrade -y && sudo reboot");
			return res.sendStatus(200);
		}else if(status=="git-push"){
			shell.exec("cd /home/tim/Scripts/Server-Application/ && sudo git commit -a -m 'Server backend backup' && sudo git push")
		}
	}catch{
		return res.sendStatus(400);
	}
});

app.get('/start', async (req, res, next) => {
	var mac = req.query.mac;
	try{
		display();
	  	shell.exec(`wakeonlan ${mac}`);
	  	return res.sendStatus(200);
	}catch{
	  	return res.sendStatus(400);
	}
  });

app.get('/testin', async (req, res, next) => {
	var status = req.query.stat
	try{
		if(status=="self"){
			const output = await shell.exec("vcgencmd measure_temp").stdout.split("'")[0].split("=")[1];
			res.set('Content-Type', 'text/plain');
			return res.send(output);
		}else{
			var ip = status+":445";
			var stat = await isReachable(ip);
			if(stat==true){
				return res.sendStatus(200);
			}else if(stat==false){
				return res.sendStatus(400);
			}
		}
	}catch(err){
		console.log(err);
		return res.sendStatus(400);
	}
});
