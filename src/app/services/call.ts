// handles incoming and outgoing video calls
import { Injectable, ApplicationRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { SocketService } from "./socket";
import { AudioService } from "./audio";
import { VideoService } from "./video";
import { Config } from "../config";
import { Subject } from "rxjs";
//import { User } from "../model/user";
//import { WaitersService } from "./waiters";
//import { NotificationsService } from "angular2-notifications";
//import { InfoService } from "./data/info.service";
//import { XirsysService } from "./data/xirsys.service";
//import { CurrentWaiterService } from "./communication/currentWaiter.service";

declare var
  window: any,
  RTCSessionDescription: any,
  RTCPeerConnection: any,
  RTCIceCandidate: any;

@Injectable()
export class CallService {
  maxTimer = 200000
  facing = 'front'
  pickupTimeout = null
  contact = null
  isInCall = false
  isCalling = false
  isAnswering = false
  //duplicateMessages
  muted = false
  lastState = null
  localStream = null
  peerConnection = null
  remoteVideo = null
  localVideo = null
  peerConnectionConfig = null
  modalShowing = false
  modal = null;
  base = null;

  myPreviousReport = null;

  // Observable string sources
  private callChangedSource = new Subject<any>();

  // Observable string streams
  callChange$ = this.callChangedSource.asObservable();

  constructor(private ref: ApplicationRef, private sanitizer: DomSanitizer,
    public socket: SocketService, private audio: AudioService,
    public video: VideoService//, private xirsysService: XirsysService
  ) {

    // browser compatability for web views
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
    window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

    // STUN/TURN ice servers for connection negotiation
    this.peerConnectionConfig = {
      'iceServers': Config.ice
    };

    this.socket.on('messageReceived', (name, message) => {
      console.log('messageReceived =====> name ====> ', name);
      console.log('messageReceived =====> message ====> ', message);

      switch (message.type) {
       case 'call':
          this.callChangedSource.next(true);
          if (this.isCalling) {
            // we are trying to call eachother. just answer it automaticly
            if (this.contact.id == name) {
              clearTimeout(this.pickupTimeout);
              this.pickupTimeout = null;
              this.isCalling = false;
              this.isAnswering = true;
              this.answer();
              return;
            }

            // ignore this incoming call if we are busy
            this.ignore(false, name);
            return;
          }
          this.audio.play('calling');
          this.contact = { id: "9876543210" };//this.waiters.get(name);
          this.isAnswering = true;
          this.showModal();
          console.log("Avant le preview !!!!");
          this.preview();
          this.refreshVideos();
          break;

        case 'answer':
          clearTimeout(this.pickupTimeout);
          this.pickupTimeout = null;

          this.isInCall = true;
          this.isCalling = false;
          this.refreshVideos();

          this.callChangedSource.next(true);
          this.call(true, this.contact.id);
          break;

        case 'ignore':
        case 'cancel':
          this.end();
          break;

        case 'end':
          if (this.isInCall || this.isCalling || this.isAnswering) {
            this.end();
          }
          break;
      }
      if (message.sdp) {
        this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(message.sdp), () => {
            if (message.sdp.type == 'offer') {
              this.peerConnection.createAnswer(d => {
                this.gotDescription(d);
              }, e => {
                console.log('createAnswer() =====> Error =====> ', e);
              });
            }
          }, (e) => {
            console.log('setRemoteDescription() =====> Error =====> ', e);
          });
      } else if (message.ice) {
        this.peerConnection.addIceCandidate(new RTCIceCandidate(message.ice), () => {
          console.log('addIceCandidate() =====> Success');
        }, (e) => {
          console.log('addIceCandidate() =====> Error =====> ', e);
        });
      }
    });
    console.log('!!! Constructor callservice 3 !!! ');
  }

  // place a new call
  public triggerCall(contact: any) {
    this.contact = contact;
    this.audio.play('calling');
    this.showModal();

    if (this.isInCall) {
      return;
    }
    this.preview();
    this.isCalling = true;
    this.socket.emit('sendMessage', contact.id, {
      type: 'call'
    });
  }

  // open the call modal
  showModal() {
    // TODO show modal
    // this.events.publish('call.trigger.show', this.contact);
    this.modalShowing = true;
  };

  gotDescription(description) {
    this.peerConnection.setLocalDescription(description, () => {
      this.socket.emit('sendMessage', this.contact.id, {
        'sdp': description
      });
    }, e => {
      console.log('gotDescription() =====> Error =====> ', e);
    });
  }

  gotIceCandidate(event) {
    if (event.candidate != null) {
      this.socket.emit('sendMessage', this.contact.id, {
        'ice': event.candidate
      });
    }
  }

  gotRemoteStream(event) {
    this.remoteVideo = event.stream;
    this.refreshVideos();

    //if (this.currentWaiter.waiter.consultationId != null) {
    //  this.startRecording(this.currentWaiter.waiter.consultationId);
    //}
  }

  // a hacky way to make sure we get the latest video position reguardless of animations or transitions
  // another way might be to use iosrtc.observeVideo(video) or an $interval
  refreshVideos() {
    // tell the modal that we need to revresh the video
    this.ref.tick();
  };

  // end the call in either direction
  end() {
    this.isInCall = false;
    this.isCalling = false;

    if (this.peerConnection) {
      this.peerConnection.close();
    }

    this.localVideo = null;
    this.remoteVideo = null;
    this.isAnswering = false;

    this.localStream = null;

    this.video.disconnect().then(() => {
      this.refreshVideos();
    });

    this.video.stopRecordAudio();

    if (!this.contact) {
      return;
    }

    this.callChangedSource.next(false);

    this.socket.emit('sendMessage', this.contact.id, {
      type: 'end'
    });
    this.contact = null;
    // this.dataCheckInterval.clear();
  }

  // add local stream
  addStream(stream, timeout) {
    this.localStream = stream;

    // TODO cireme check for local video
    setTimeout(() => {
      this.localVideo = stream;
    }, timeout);
  }

  // preview local video as full screen
  preview() {
    this.video.connect(true, true, this.facing, this.contact)
      .then(stream => {
        this.addStream(stream, 10);
      })
      .catch(error => {
        console.log('1 - this.preview() =====> Error ====> ', error);
      });
  };

  // begin a call using webrtc
  call(isInitiator, contactId) {
    var connect = () => {

     // this.xirsysService.getXirsysUrls().subscribe(
     //   (data) => {
          try {

            if (navigator.userAgent.indexOf('Safari') != -1 || navigator.userAgent.indexOf('Chrome') != -1 ||
              navigator.userAgent.indexOf('Edge') != -1) { //|| navigator.userAgent.indexOf('Mozilla') != -1) {
             // data = JSON.stringify(data).replace(new RegExp('url', 'g'), 'urls');
             // data = JSON.parse(data);
            }

            //console.log('servers - ', data);

            //this.peerConnection = new RTCPeerConnection(data.v);
            this.peerConnection = new RTCPeerConnection(Config.ice);

            this.peerConnection.onicecandidate = this.gotIceCandidate.bind(this);
            this.peerConnection.onaddstream = this.gotRemoteStream.bind(this);

            this.peerConnection.oniceconnectionstatechange = event => {
              console.log("event ====> ", event);

              this.lastState = event.target.iceConnectionState;

              console.log("this.lastState ====> ", this.lastState);

              //if (this.lastState === 'disconnected') {
              //  console.log('ice state changed to disconnected - wait for reconnection');
              //  if (this.contact != null) {
              //    this.ngZone.run(() => {
              //      this.notifsService.error('Visio', "La connexion s'est interrompue de manière inattendue.");
              //    });
              //  }
              //}

              if (this.lastState === 'failed' || this.lastState === 'disconnected') {
                if (this.contact != null) {
                  //this.ngZone.run(() => {
                    //this.notifsService.info('Visio', "La connexion s'est interrompue de manière inattendue. Une tentative de reconnexion est en cours...");
                  //});
                  connect();
                } else {
                  console.log('ice state changed to failed or closed on call end');
                }
              }
            };

            if (this.localStream != null) {
              this.peerConnection.addStream(this.localStream);
            }

            if (isInitiator) {
              //this.isCalling = true;
              this.peerConnection.createOffer(d => {
                //this.gotDescription.call(this, [d]);
                this.gotDescription(d);
              }, e => {
              });
            } else {
              //this.isAnswering = true;
            }
          }
          catch (error) {
            console.log('this.xirsysService.getXirsysUrls() ===> error ===> ', error);
          }
     //   });
    };
    if (this.localStream == null) {
      this.video.connect(true, true, this.facing, this.contact)
        .then(stream => {
          this.addStream(stream, 1000);
          connect();
        })
        .catch(error => {
          console.log('3 - this.preview() =====> Error ====> ', error);
        });
    } else {
      connect();
    }
  }

  // cancel a call being placed
  cancel() {
    this.socket.emit('sendMessage', this.contact.id, {
      type: 'cancel'
    });
    this.end();
  };

  // ignore an incomming call
  ignore(end, name) {
    this.socket.emit('sendMessage', name || this.contact.id, {
      type: 'ignore'
    });
    if (!end) return;
    this.end();
  };

  // answer in incoming call
  answer() {
    if (this.isInCall) {
      return;
    }

    clearTimeout(this.pickupTimeout);
    this.pickupTimeout = null;

    // TODO : ajout      
    //this.preview();

    this.isInCall = true;
    this.isAnswering = false;
    this.call(false, this.contact.id);

    setTimeout(() => {
      this.socket.emit('sendMessage', this.contact.id, {
        type: 'answer'
      });
    });
    this.refreshVideos();
  }

  // mute the microphone and attach a new stream to connection
  // note: doesnt seem to work quite right on all brwosers
  mute() {
    this.muted = !this.muted;

    if (this.muted) {
      this.video.mute(this.peerConnection, true).then(stream => {
        this.addStream(stream,1000);
      });
    } else {
      this.video.mute(this.peerConnection, false).then(stream => {
        this.addStream(stream, 1000);
      });
      //this.video.unmute();
    }
  }

  startRecording(consulationId) {
    if (this.remoteVideo) {
      this.video.initRecordAudio(this.remoteVideo);
      this.video.startRecordAudio(consulationId);
    }
  }
}
