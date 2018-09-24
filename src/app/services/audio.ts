// audio handler for native audio with fallback for html5 audio
import {Injectable} from "@angular/core";
import {Config} from "../config";

@Injectable()
export class AudioService {
  ready = null;
  audio = []
  volume = .4

  constructor() {

    //this.ready = new Promise((resolve, reject) => {

    //  // promise that only fires after all files have loaded
    //  let files = ['login', 'message-received-back', 'message-received-front', 'message-sent', 'calling'];
    //  let c = 1;

    //  files.forEach(file => {
    //    this.audio[file] = new Audio('assets/audio/' + file + '.mp3');
    //    this.audio[file].volume = this.volume;
    //  });

    //  resolve();
    //});

    //this.ready.then(() => {
    //  console.debug('Audio initilized.');
    //});
  }

  // play an audio clip
  public play(clip) {
    //if (!Config.audio) {
    //  return;
    //}
    //this.ready.then(() => {
    //  this.audio[clip].play();
    //});
  }
}
