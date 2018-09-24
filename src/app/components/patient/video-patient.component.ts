import { Component, OnInit, OnDestroy } from "@angular/core";
import { CallService } from "../../services/call";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SocketService } from "../../services/socket";
import { AudioService } from "../../services/audio";
import { NotificationsService } from "angular2-notifications";

declare const $: any;

@Component({
  selector: 'video-patient',
  templateUrl: 'video-patient.component.html',
  styleUrls: [
    'video-patient.component.scss'
  ]
})
export class VideoPatientComponent implements OnInit, OnDestroy {

  private callSubscription: Subscription;

  public doctorName: string = null;
  public medecinId: string = null;

  public isLate: boolean = null;

  public canceled: boolean = false;

  btnMutOn = true;
  btnMutOff = false;

  inConsult;
  compterendu;
  Msgcompterendu = "";
  listPrescId = [];
  currPrescIndex;
  prescription;
  MsgPresc;
  patient;
  modePrint = "print";
  displaySign = true;
  medPreview = false;
  isConseilStandard = false;

  ngOnInit(): void {
    let that = this;

    this.callSubscription = this.callService.callChange$.subscribe(state => {
      console.log("callService.callChange");
      that.inConsult = (that.inConsult || state);
    });

    var user2 = {
      id: "0123456789",
      username: "PatientUsername",
      kind: "Patient",
      name: "PatientName"
    }

    this.socket.emit('login_fake', user2);
  }

  ngOnDestroy(): void {
    this.callSubscription.unsubscribe();
    //this.currentWaiterService.changeWaitingState(false);
  }

  constructor(private router: Router, public callService: CallService, private notificationsService: NotificationsService,
    private socket: SocketService,
    private audio: AudioService) {

    console.log("ffefezfzzfeqzgefvgbbffdbdxx");

    this.inConsult = false;
    let that = this;

    this.socket.on('end-call-med', function () {
      that.notificationsService.info('Visio', 'Votre médecin a raccroché...');
    });

    this.socket.on('medic-preview', function (medic) {
      console.log('medic-preview => medic =>', medic);
      that.medicPreview(medic);
    });

    this.socket.on('medic-late', function () {
      that.medicLate();
    });

    this.socket.on('medic-cancel', function () {
      that.medicCancel();
    });

    this.Msgcompterendu = "Le compte rendu sera affiché dès qu'il sera validé par le médecin";
    this.MsgPresc = "La prescription sera affichée dès qu'elle sera validée par le médecin";

  }

  endCall() {
    this.socket.emit('end-call-pat', this.medecinId);
  }

    checkInconsult() {

      console.log("checkInconsult");
      try {
        //this.inConsult=(this.inConsult || this.callService.isInCall || this.callService.isAnswering);
      } catch (e) {
        console.log("checkInconsult: Erreur");
        console.log(e);
      }
      this.inConsult = true;

      console.log(this.inConsult);

    }

    back() {
      this.router.navigateByUrl('patient');
    }

    cancelDemand() {   
      this.back();
    }

    medicPreview(medic) {
      console.log("medicPreview");
      this.isLate = false;
      this.canceled = false;
      if (medic.user != null) {
        this.doctorName = "Dr " + medic.user.username;
        this.medecinId = medic.user.id;
      }
      else {
        if (medic != "") {
          this.doctorName = medic;
        }
        else {
          this.doctorName = "XXX";
        }
      }

      //try {
      //  this.doctorName = medic.user.username;
      //} catch (e) {
      //  this.doctorName = "XXX";
      //}
      this.audio.play('message-received-front');
    }

    medicLate() {
      console.log("medicLate");
      this.isLate = true;
      this.audio.play('message-received-front');
    }

    medicCancel() {
      console.log("medicCancel");
      this.canceled = true;
      this.audio.play('message-received-front');
    }

    mute(isMute) {

      if (isMute) {
        this.btnMutOff = true;
        this.btnMutOn = false;
      }
      else {
        this.btnMutOff = false;
        this.btnMutOn = true;
      }

      this.callService.mute();
    }
}
