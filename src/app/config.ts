// static config variables
import {Component} from "@angular/core";

@Component({})
export class Config {

  // url of the chat server
  // for local development it will be something like http://192.168.0.214:9000/

  //public static server = 'https://medicitussrv.herokuapp.com';
  //public static server = 'https://securemedicitus.idshost.fr';

  // enables or disables chat sounds. usefull for development
  public static audio = true;

  // STUN/TURN ice servers for connection negotiation

 // 	public static ice = [
	//	{"urls": "stun:e1.xirsys.com"},
	//	{"urls":["turn:e1.xirsys.com:80?transport=udp",
	//	"turn:e1.xirsys.com:3478?transport=udp",
	//	"turn:e1.xirsys.com:80?transport=tcp",
	//	"turn:e1.xirsys.com:3478?transport=tcp",
	//	"turns:e1.xirsys.com:443?transport=tcp",
	//	"turns:e1.xirsys.com:5349?transport=tcp"],
	//	"username": "ca77a07a-b400-11e7-8ed6-5003ba28403d",
	//	"credential": "ca77a0f2-b400-11e7-85b6-cd46169a8e33"}
	//];

  public static ice = [
    {
      urls: 'stun:stun.l.google.com:19302'
    }, {
      urls: 'stun:stun.services.mozilla.com'
    }, {
      urls: 'stun:numb.viagenie.ca',
      username: 'emeric.stophe@gmail.com',
      credential: ':v3Mf34NX93W'
    }, {
      urls: 'turn:numb.viagenie.ca',
      username: 'emeric.stophe@gmail.com',
      credential: ':v3Mf34NX93W'
    }
  ];

  // if we allow attachments or not.
  // be sure to configure your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and S3_BUCKET in the server config
  public static attachments = true;

  // whether or enable markdown parsing client side
  public static markdown = true;
}
