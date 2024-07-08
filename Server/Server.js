const express = require('express');
const cors = require('cors');
const shell = require('shelljs');
const ytdl = require('ytdl-core');
const ping = require('ping');
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
	}else if(datestat>="08:00:00"){
		if(uhr<="08:00:00"){
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
	shell.exec("sudo uhubctl -l 1-1 -a off 1>&-");
	activated = "True";
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
		}else if(status=="raspi-reboot"){
			shell.exec("sudo apt update && sudo apt full-upgrade -y && sudo reboot");
			return res.sendStatus(200);
		}else if(status=="git-push"){
			shell.exec("cd /home/tim/Scripts/Server-Application/ && sudo git commit -a -m 'Saving Github Pages backend' && sudo git push");
			display();
			return res.sendStatus(200);
		}else if(status=="shutdown"){
			shell.exec("net rpc shutdown -t 5 -C 'Remote Neustart' -I 192.168.115.66 -U tim-b%70mauS18");
			display();
			return res.sendStatus(200);
		}else if(status=="reboot"){
			shell.exec("net rpc shutdown -r -t 5 -C 'Remote Shutdown' -I 192.168.115.66 -U tim-b%70mauS18");
			display();
			return res.sendStatus(200);
		}
	}catch(err){
		console.log(err);
		return res.sendStatus(400);
	}
});

app.get('/start', async (req, res, next) => {
	var mac = req.query.mac;
	try{
		display();
	  	shell.exec(`wakeonlan ${mac}`);
	  	return res.sendStatus(200);
	}catch(err){
		console.log(err);
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
			ping.sys.probe(status, function(isAlive){
				isAlive ? send(200) : send(400);
			});
		}
		async function send(stat){
			return res.sendStatus(stat);
		}
	}catch(err){
		console.log(err);
		return res.sendStatus(400);
	}
});
