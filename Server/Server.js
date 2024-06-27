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
        		shell.exec(`echo Usb aus`);
        		activated = "True";
			}
		}
	}
	setTimeout(date, 500);
}

date();

app.use(cors());

app.listen(PORT, () => {
	console.log(`Server Works !!! At port ${PORT}`);
});

app.get('/usb', async (req, res, next) => {	
	var status = req.query.stat;
	try{
		if(status=="on"){
			shell.exec("sudo uhubctl -l 1-1 -a on 1>&-");
			shell.exec(`echo "Usb an"`);
			datestat = new Date().toLocalTimeString();
			activated = "False";			
			return res.sendStatus(200);
		}else if(status=="off"){
			shell.exec("sudo uhubctl -l 1-1 -a off 1>&-");
			shell.exec(`echo Usb aus`);
			datestat = new Date().toLocaleTimeString();
			activated = "True";
			return res.sendStatus(200);
		}
	}catch{
		return res.sendStatus(400);
	}
});

app.get('/start', async (req, res, next) => {
	var mac = req.query.mac;
	try{
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
			return res.sendStatus(200);
		}else{
			let host = await ping.promise.probe(status);
			console.log(host);
		}
	}catch{
		return res.sendStatus(400);
	}
});

app.get('/test', async (req, res, next) => {
	return res.sendStatus(200);
});

/*app.get('/downloadmp3', async (req, res, next) => {
	try {
		var url = req.query.url;
		if(!ytdl.validateURL(url)) {
			return res.sendStatus(400);
		}

        let title = "audio";

		await ytdl.getBasicInfo(url, {
			format: 'mp3'
		}, (err, info) => {
			if (err) throw err;
			title = info.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
		});

		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
		ytdl(url, {
			format: 'mp3',
			filter: 'audioonly',
		}).pipe(res);

	} catch (err) {
		console.error(err);
	}
});

app.get('/downloadmp4', async (req, res, next) => {
	try {
		let url = req.query.url;
		if(!ytdl.validateURL(url)) {
			return res.sendStatus(400);
		}

		let title = "video";

		await ytdl.getBasicInfo(url, {
			format: 'mp4'
		}, (err, info) => {
			title = info.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
		});
		
		res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
		ytdl(url, {
			format: 'mp4',
			quality: 'highest'
		}).pipe(res); 

	} catch (err) {
		console.error(err);
	}
});
*/
