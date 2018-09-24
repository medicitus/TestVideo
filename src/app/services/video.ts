// manages video elements

import { Injectable } from '@angular/core';
import { NetworkService, NetworkType } from "./data/network.service";

declare var navigator: any;
declare var MediaRecorder: any;
declare var MediaSource: any;
declare var window: any;

declare var AudioContext: any;

@Injectable()
export class VideoService {
  localStream = null;
  facing = 'front';
  recorder;

  networkType: NetworkType;

  constructor(private network: NetworkService, ) {
    network.networkChange$.subscribe(type => this.networkType = type);
    // network.getNetwork();
  }

  connect(audio, video, facing, contact) {
    let videoSize = this.getVideoSize('default');

    let self = this;
    return new Promise((resolve, reject) => {
      var connect = () => {
        var videoOptions = {
          deviceId: null
        };

        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;

        navigator.mediaDevices.getUserMedia(
          {
            audio: audio ? true : false,
            video: {
              width: { min: 320, ideal: 640, max: 640/*videoSize.width*/ },
              height: { min: 240, ideal: 480, max: 480/*videoSize.height*/ }
            }
          })
          .then((stream) => {

            this.localStream = stream;

            resolve(stream);
          })
          .catch((error) => {
            reject(error);
          });
      };

      try {
        if (this.localStream) {
          self.disconnect().then(connect);
        } else {
          connect();
        }
      } catch (error) {
      }
    });
  }

  getVideoSize(connectionType) {
    let size = { height: null, width: null };
    size.width = 640;
    size.height = 480;

    //switch (connectionType) {
    //  case "wifi":
    //    size.width = 640;
    //    size.height = 480;
    //    break;
    //  case "ethernet":
    //    size.width = 640;
    //    size.height = 480;
    //    break;
    //  case "2g":
    //    size.width = 320;
    //    size.height = 240;
    //    break;
    //  case "3g":
    //    size.width = 640;
    //    size.height = 480;
    //    break;
    //  case "4g":
    //    size.width = 640;
    //    size.height = 480;
    //    break;
    //  case "cellular":
    //    size.width = 320;
    //    size.height = 240;
    //    break;
    //  default:
    //    size.width = 320;
    //    size.height = 240;
    //}

    return size;
  }

  // mute audio
  // @todo: make this reestablish a connection
  muteback() {
    return new Promise((resolve, reject) => {
      if (this.localStream) {
        var tracks = this.localStream.getAudioTracks();
        for (var x in tracks) {
          tracks[x].enabled = false;
        }
      }
      resolve(this.localStream);
    });
  }

  // unmute audio
  // @todo: make this reestablish a connection
  unmute() {
    var self = this;
    return new Promise((resolve, reject) => {
      if (this.localStream) {
        var tracks = this.localStream.getAudioTracks();
        for (var x in tracks) {
          tracks[x].enabled = true;
        }
      }
      resolve(this.localStream);
    });
  }

  mute(peerConnCallee, isCam): any {
    //this.facing = facing;
    return new Promise((resolve, reject) => {
      if (this.localStream) {

        navigator.mediaDevices.enumerateDevices().then(devices => {
          console.log("devices =======> ", devices);

          var tracks = this.localStream.getTracks();
          tracks.forEach(function (track) {
            track.stop();
          });

          console.log("rferferferfreferfe =======> ");

          var constraints = tracks[0].getConstraints();

          console.log("constraints =======> ", constraints);

          var microscropes = devices.filter(d => d.label == "Digital Microscope");

          if (microscropes != null && microscropes.length > 0) {

            console.log("microscropes =======> ", microscropes);


            if (isCam) {
              constraints.deviceId = microscropes[0].deviceId;
            }
            else {
              constraints.deviceId = null;
            }

            navigator.getUserMedia({
              audio: true,
              video: constraints
            },
              stream => {
                //console.log('got local MediaStream: ', stream, stream.getTracks());
                try {                  

                  stream.getVideoTracks().forEach(function (track) {
                    var sender = peerConnCallee.getSenders().find(function (s) {
                      return s.track.kind == track.kind;
                    });
                    sender.replaceTrack(track);
                  });
                  
                  setTimeout(function () {
                    peerConnCallee.addStream(stream);
                    this.localStream = stream;
                  }, 300);

                }
                catch (e) {
                  console.log("erreur !!!!", e);
                }

                resolve(stream);
              },
              error => {
                console.error('getUserMedia failed: ', error);
                reject();
              });
          }
        });
      }
    });
  }


  // disconnect the media stream
  disconnect() {
    return new Promise((resolve, reject) => {
      if (this.localStream) {
        var tracks = this.localStream.getVideoTracks() || this.localStream.getTracks();
        for (var x in tracks) {
          tracks[x].stop();
        }
        console.debug('stoping stream', this.localStream.getVideoTracks() || this.localStream.getTracks());
        this.localStream = null;
      }
      resolve();
    });
  }

  initRecordAudio(remoteStream) {
    /* /* A tester
    const ac = new AudioContext();
    var md = ac.createMediaStreamSource(new MediaStream(this.localStream.getAudioTracks()));
    var md1 = ac.createMediaStreamSource(new MediaStream(remoteStream.getAudioTracks()));

    var sources = [];
    sources.push(md);
    sources.push(md1);
    // const sources = this.audioTracks.map(t => ac.createMediaStreamSource(new MediaStream([t])));
    const dest = ac.createMediaStreamDestination();
    sources.forEach(s => s.connect(dest));
    this.recorder = new MediaRecorder(dest.stream);
    */
  }

  startRecordAudio(consulationId) {
    /* A tester
    this.recorder.start();
    this.recorder.ondataavailable = e => {
      console.log("Got data", e.data);
      var blob = e.data;
      var that = this;
      this.blobToBase64(blob, function (base64) {
        var name = consulationId + "_" + new Date().getTime() + ".ogg";
        that.consultationService.recordAudio(base64, name).subscribe(i => {
          console.log("recordAudio ======> OK");
        });
      });      
    };
    this.recorder.onstop = (e) => console.log("stopped", e);
    */
  }

  stopRecordAudio() {
    /* A tester
   this.recorder.stop();
   */
  }

  blobToBase64(blob, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      cb(base64);
    };
    reader.readAsDataURL(blob);
  };
}
