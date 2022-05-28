/* Name: Joseph Dadic
   Course: CS 355 Internet and Web Technologies
   Assignment: Final Project
   Collaboration: None
   
client_id and client_secret hidden for security reasons. Code is to demonstrate the ability of programming
using JavaScript without the help of any external libraries. Used Google Drive API and an API with no key requirements
to demonstrate being able to use a OAuth 2.0 API.*/





const fs = require("fs");
const http = require('http');
const https = require('https');
const url = require('url');
const scope = "https://www.googleapis.com/auth/drive";
const client_id =    // Hidden for security purposes.
const redirect_uris = "http://localhost:3000/success";
const client_secret = //Hidden for security purposes.
const port = 3000;
const object = JSON.parse(fs.readFileSync('auth/credentials.json', 'utf8'));
let accessToken = '';
const server = http.createServer();

const googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

const credentials = require('./auth/credentials.json');

server.on("request", connection_handler);
function connection_handler(req, res){
    const url =  new URL(req.url, 'http://' + req.headers.host);

    console.log(`New Request for ${req.url} from ${req.socket.remoteAddress}` );
    if (req.url === "/") {
    
    res.writeHead(301, {Location: googleAuthentication()})
    res.end();
    
    }else if(req.url.startsWith("/success")){
        
        //const accessToken = query.substring(query.indexOf('code='), query.indexOf('&'));
        const code = url.searchParams.get('code');
        console.dir(code);
        tokenRequest(code);
        const formtwo = fs.createReadStream("html/success.html");
        res.writeHead(200, {'Content-Type': "text/html"})
        formtwo.pipe(res);
    }else if (req.url.startsWith('/lyrics')){
        apiRequestLyrics(url.searchParams.get('song_artist'), url.searchParams.get('song_title'), res);
    }
}
function apiRequestLyrics(artist,title, res){
    const request = https.request({host: 'api.lyrics.ovh', path: '/v1/'+ encodeURIComponent(artist) +'/'+ encodeURIComponent(title) , method: 'GET'}, (lyricsRes) => {
        lyricsRes.on('data', function(rawData){
            const apiData = JSON.parse(rawData);
            console.dir(apiData);
            const lyrics = apiData.lyrics;
            driveRequest(artist, title, lyrics, res);
        })
    })
    request.end();
}
function driveRequest(artist, title, lyrics, res){

    const request =  https.request('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', {
        method: 'POST',
        headers: {'Content-Type': 'text/plain', Authorization: 'Bearer '+ accessToken },
         
     },(driveRes) => {
         console.log("statusCode: ", driveRes.statusCode);
         console.log("headers: ", driveRes.headers);
     
         driveRes.on('data', function(driveData) {
             console.dir(driveData);
             res.writeHead(200, {'Content-Type': 'text/plain'} )
             res.write("Finished, Check Your Google Drive Account!");
             res.end();
         });
     });
    request.write(lyrics);
     request.end();
 }
function tokenRequest(code){
   const request =  https.request('https://oauth2.googleapis.com/token',{
        host: 'oauth2.googleapis.com', path: '/token', method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        
    },(res) => {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);
    
        res.on('data', function(tokenData) {
            accessToken = JSON.parse(tokenData).access_token;
            console.dir(accessToken);
        });
    });
    request.write('code='+code);
    request.write('&client_id='+client_id);
    request.write('&client_secret='+client_secret);
    request.write('&redirect_uri='+redirect_uris);
    request.write('&grant_type=authorization_code');
    request.end();
}


function googleAuthentication(){
     return "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirect_uris+"&prompt=consent&response_type=code&client_id="+client_id
            +"&scope="+scope;
        }
server.on("listening", listening_handler);
function listening_handler(){
    console.log(`Now Listening on Port ${port}`)
}

server.listen(port);