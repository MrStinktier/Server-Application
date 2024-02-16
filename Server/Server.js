const express = require('express');
const cors = require('cors');
const shell = require('shelljs');
const ytdl = require('ytdl-core');
const app = express();
const PORT = 4000;

app.use(cors());

app.listen(PORT, () => {
	console.log(`Server Works !!! At port ${PORT}`);
});

/*app.get('/Wakeup', async (req, res, next) => {
  try{
    shell.exec('wakeonlan 00:13:3b:0c:64:3f');
    shell.exec('wakeonlan 00:13:3b:0c:64:3e');
    //shell.exec('wakeonlan ');
    return res.sendStatus(200);
  }catch{
    return res.sendStatus(400);
  }
})*/

app.get('/start', async (req, res, next) => {
	var mac = req.query.mac;
	try{
	  shell.exec(`wakeonlan ${mac}`);
	  return res.sendStatus(200);
	}catch{
	  return res.sendStatus(400);
	}
  })

app.get('/test', async (req, res, next) => {
	return res.sendStatus(200);
})

app.get('/downloadmp3', async (req, res, next) => {
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

app.get('/language', async (req, res, next) => {
	try{
		let lang = req.query.lang;
		if(lang == "en"){
			res.sendFile('/home/tim/Scripts/Server-Application/htmls/en.html');
		}else if(lang == "de"){
			res.sendFile('/home/tim/Scripts/Server-Application/htmls/de.html');
		};
	}catch (err){
		console.error(err);
	}
});