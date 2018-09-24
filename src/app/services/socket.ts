// handle socket io connections
import {Injectable} from "@angular/core";
import * as io from "socket.io-client";
import { UrlService } from "./url.service";

@Injectable()
export class SocketService {
  socket = null;

  constructor(private urlService: UrlService) {
    // connect to our server
    // change this url here
    this.socket = io.connect(this.urlService.baseUrl, {
      'reconnection': true,
      'reconnectionDelay': 1000,
      'reconnectionAttempts': 5
    });

    console.log("socket 1 : ", this.socket);
  }

  // generate a unique custom request id
  private makeId(len) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$';
    for (var i = 0; i < (len || 10); i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  // send an event and get a response back
  public promise(eventName, request) {
    return new Promise((resolve, reject) => {

      var success = response => {
        this.socket.removeListener(request.responseName, success);
        resolve(response);
      };

      request.responseName = '$response$' + this.makeId(10) + '$';
      this.socket.on(request.responseName, success);
      this.socket.emit(eventName, request);
    });
  }

  public emit(...args: any[]) {
    console.log("socket: " + this.socket.id);
    //args.push({ socketId: this.socket.id})
    this.socket.emit(...args)
    // @BUG
    //this.socket.emit(args[0], args[1]);
  }

  public on(name, data) {
	console.log("socket.on: " + this.socket.id);
    this.socket.on(name, data);
  }

  public removeListener(name, data) {
    this.socket.removeListener(name, data);
  }
}
