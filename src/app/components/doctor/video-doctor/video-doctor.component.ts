import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { CallService } from "../../../services/call";
//import { ConsultationService } from "../../../services/data/consultation.service";
//import { RdvService } from "../../../services/data/rdv.service";
//import { StripeAPIService } from "../../../services/data/stripeAPI.service";
//import { LoginService } from "../../../services/login";
//import { DonneesSante } from "../../../model/medical/DonneesSante";
//import { CompteRendu } from "../../../model/medical/CompteRendu";
//import { PatientService } from "../../../services/data/patient.service";
import { Subscription } from "rxjs";
//import { CurrentWaiterService } from "../../../services/communication/currentWaiter.service";
//import { LogextService } from "../../../services/data/logext.service";
import { NotificationsService } from "angular2-notifications";
import { SocketService } from "../../../services/socket";
//import { DIAG, ORIENTATION } from "../../../services/data/medical.data";
//import { PrescriptionService } from "../../../services/data/prescription.service"


declare const $: any;

@Component({
  selector: 'video-doctor',
  templateUrl: 'video-doctor.component.html',
  styleUrls: [
    'video-doctor.component.scss'
  ]
})
export class VideoDoctorComponent implements OnInit, OnDestroy {

  fieldName: string = '';

  consultation: any = null;
  consultationId;
  consultChanged: boolean = false;

  //compterendu: CompteRendu = null;
  //crHisto: CompteRendu = null; //cr d'une ancienne consult
  displayCrHisto: boolean = false;

  displayHistoConsult: boolean = false;

  isAnnulation: boolean = false;

  contactId: string;
  antecedents: string = null;

  editionModel: string = '';

  //donneesSante: DonneesSante;
  donneesSanteChanged: boolean = false;

  callSubscription: Subscription;

  hangedUp: boolean = false;

  causesFin;
  diags;
  orientations;

  selcausesFin;
  seldiag;
  selorientation;
  consultALD;
  comment;

  displayCall = false;
  displayResetCall = true;

  isConseilStandard: boolean = false;
  isConseilPremium: boolean = false;
  isConseil: boolean = false;

  paymentToken: string;

  btnMutOn = false;
  btnMutOff = false;
  btnRaccrocher = false;
  btnAppeler = true;

  txtConfirmCrValidate = "";

  isPreviewFeuilleSoin: boolean = false;

  ngOnDestroy(): void {
    this.callSubscription.unsubscribe();
    //this.currentWaiter.changeWaitingState(false);
  }

  ngOnInit(): void {
    var user = {
      id: "9876543210",
      username: "MedecinUsername",
      kind: "Medecin",
      name: "MedecinName"
    }

    this.socket.emit('login_fake', user);
  }

  constructor(public router: Router, public callService: CallService,
    //private stripeAPIService: StripeAPIService, private prescriptionService: PrescriptionService,
    //private consultationService: ConsultationService, private loginService: LoginService, private rdvService: RdvService,
    //private patientService: PatientService, private currentWaiter: CurrentWaiterService, private logService: LogextService,
    private _notifservice: NotificationsService, private socket: SocketService) {

    // this.consultationId = this.currentWaiter.waiter.consultationId;

    this.txtConfirmCrValidate = "Au moins une prescription n'est pas validée, souhaitez-vous valider quand même le compte rendu ?";

    // this.currentWaiter.changeWaitingState(true);

    this.callSubscription = this.callService.callChange$.subscribe(state => {
      console.log('this.callService ==> ', this.callService);
      if (state) {
        if (this.callService.isInCall) {
          // this.getConsultation();
          this.displayResetCall = false;
        }
      } else {
        this.hangedUp = true;
        this.displayCall = true;
      }

      if (this.callService.isInCall || this.callService.isCalling || this.callService.isAnswering) {
        this.btnRaccrocher = true;
        this.btnMutOn = true;
        this.btnMutOff = false;
        this.btnAppeler = false;
      }
      else {
        this.btnRaccrocher = false;
        this.btnMutOn = false;
        this.btnMutOff = false;
        this.btnAppeler = true;
      }
    });

    var that = this;
    this.socket.on('end-call-pat', function () {
      that._notifservice.info('Visio', 'Votre patient a raccroché...');
    });

    //this.diags = JSON.parse(JSON.stringify(DIAG));
    //this.orientations = JSON.parse(JSON.stringify(ORIENTATION));
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

  //initCauses(cause) {
  //  this.causesFin = [];

  //  if (cause == 'fin') {
  //    this.isAnnulation = false;
  //    if (this.isConseilStandard) {
  //      this.causesFin.push({ id: 3, name: 'Fin du conseil' });
  //    }
  //    else {
  //      this.causesFin.push({ id: 1, name: 'Fin de la consultation' });
  //    }
  //    this.causesFin.push({ id: 2, name: 'Problème technique' });
  //  }
  //  else if (cause == 'annulation') {
  //    this.isAnnulation = true;
  //    this.causesFin.push({ id: 2, name: 'Problème technique' });
  //    this.causesFin.push({ id: 4, name: 'Autre' });

  //  }
  //}

  //getConsultation() {
  //  this.contactId = this.callService.contact.id;
  //  console.log("this.callService.contact ==> ", this.callService.contact);

  //  if (this.consultation == null) {
  //    this.consultationService
  //      .getConsultation(this.currentWaiter.waiter.consultationId)
  //      .subscribe(consultation => {
  //        this.consultation = consultation;
  //        this.consultationId = consultation._id;
  //        this.consultation.motif = this.currentWaiter.waiter.symptomes.text;

  //        if (this.donneesSante == null) {
  //          this.patientService.getDonneesSante(this.contactId).subscribe(
  //            donneesSante => this.donneesSanteLoaded(donneesSante)
  //          );
  //        }

  //        // si des prescriptions existent (cas de la reprise d'un rendez-vous) on l'envoie au patient
  //        this.prescriptionService.getPrescriptionsByConsult(consultation._id).subscribe(prescriptions => {
  //          prescriptions.forEach(presc => {
  //            this.prescValidated(presc._id);
  //          });
  //        });

  //        // si un compte rendu existe (cas de la reprise d'un rendez-vous) on l'envoie au patient
  //        this.patientService.getCompteRenduByConsult("" + this.consultation._id)
  //          .subscribe(compterendu => {
  //            if (compterendu != null) {
  //              this.validCR()
  //            }
  //          });

  //        this.rdvService.getRdv(this.consultation.rdvId).subscribe(rdv => {
  //          this.isConseilPremium = rdv.isConseilPremium;
  //          this.isConseilStandard = rdv.isConseilStandard;
  //          this.isConseil = this.isConseilStandard == true || this.isConseilPremium;
  //          this.paymentToken = rdv.paymentToken;
  //        });
  //      });
  //  }
  //  else {
  //    if (this.donneesSante == null) {
  //      this.patientService.getDonneesSante(this.contactId).subscribe(
  //        donneesSante => this.donneesSanteLoaded(donneesSante)
  //      );
  //    }
  //  }
  //}

  //donneesSanteLoaded(donneesSante: DonneesSante) {
  //  this.logService.logPage('Données santé', this.consultation.patient._id, 2, this.logService.getFormattedDate(this.consultation.date)).subscribe();

  //  this.donneesSante = donneesSante;

  //  if (this.donneesSante.allergies == null) {
  //    this.donneesSante.allergies = '';
  //  }

  //  if (this.donneesSante.allergiesMedicamenteuses == null) {
  //    this.donneesSante.allergiesMedicamenteuses = '';
  //  }

  //  if (this.donneesSanteChanged) {
  //    this.donneesSanteChanged = false;
  //    this.showMessageSave('données de santé', true);
  //  }
  //}

  endAppointment() {

    console.log("endAppointment");

    console.log("this.hangedUp ==> " + this.hangedUp);

    //if (!this.hangedUp)
    if (this.callService.isInCall || this.callService.isCalling || this.callService.isAnswering) {
      this.callService.end();
    }

  }

  endCall() {
    this.callService.end();
    this.btnRaccrocher = false;
    this.btnAppeler = true;
    this.btnMutOff = false;
    this.btnMutOn = false;

    // this.socket.emit('end-call-med', this.currentWaiter.waiter);
  }

  callPatient() {

    try {
      if (this.callService.isInCall || this.callService.isCalling || this.callService.isAnswering) {
        this.callService.end();
      }

      this.btnAppeler = false;
      this.btnRaccrocher = true;
      this.btnMutOff = false;
      this.btnMutOn = true;

      this.callService.triggerCall({ id: '0123456789' });

    } catch (e) {
      console.log("callPatient: Erreur");
      console.log(e);
    }

    this.displayCall = false;

  }

  showMessageSave(typeDonnees, success) {

    let options = {
      timeOut: 1000,
      showProgressBar: false,
      pauseOnHover: true
    };

    if (success == true) {
      this._notifservice.success(
        'Enregistrement',
        'Les ' + typeDonnees + ' ont été enregistrées...',
        options);
    } else {
      this._notifservice.error(
        'Enregistrement',
        'Les ' + typeDonnees + 'n\'ont pas été enregistrées...',
        options);
    }

  }

  //onConfirmChoised(choise: boolean) {
  //  if (choise) {
  //    this.initCR(null);
  //    $('#openModalEditCR').click();
  //    $('#confirmPopup_closeModal').click();
  //  }
  //}

  //checkIfPrescValidate() {    

  //  this.prescriptionService.getPrescriptionsByConsult(this.consultation._id).subscribe(prescriptions => {
  //    console.log("prescriptions =====> ", prescriptions);
  //    var prescNotValidated = prescriptions.filter(presc => presc.status == null); // on remonte toutes les prescriptions validées (status = 1)
  //    if (prescNotValidated != null && prescNotValidated.length > 0) {
  //      $('#confirmPopup_openModal').click();
  //    }
  //    else {
  //      // On peut valider le cr
  //      this.initCR(null);
  //      $('#openModalEditCR').click();

  //    }
  //  });
  //}

  //genererFeuilleSoin() {
  //  let nom = "DA SILVA Jonathan";
  //  let numSecu = "0123456789012";
  //  let cleSecu = "01";
  //  let datenaissance = "22111990";
  //  let adresse = "12 rue Jean Rochon";
  //  let nomMedecin = "Dr DECKER Jean-Luc";
  //  let adresseMedecin = "94 Boulevard Lafayette";
  //  let cpVilleMedecin = "63000 Clermont-Ferrand";
  //  let paysMedecin = "FRANCE";
  //  let dateActe = "23072018";
  //  let codeActe = "CCCC";
  //  let montantActe = "28,00";
  //  let montantTotal = "28,00";

  //  var body = {
  //    nom : nom,
  //    numSecu : numSecu,
  //    cleSecu : cleSecu,
  //    datenaissance : datenaissance,
  //    adresse : adresse,
  //    nomMedecin : nomMedecin,
  //    adresseMedecin : adresseMedecin,
  //    cpVilleMedecin: cpVilleMedecin,
  //    paysMedecin: paysMedecin,
  //    dateActe : dateActe,
  //    codeActe : codeActe,
  //    montantActe : montantActe,
  //    montantTotal : montantTotal
  //  }

  //  this.consultationService.generateFeuilleSoin(body).subscribe(c => {
  //    console.log(c);
  //  });
  //}

  //previewFeuilleSoin(isPreview) {
  //  this.isPreviewFeuilleSoin = isPreview;
  //}

  //onFeuilleSoinSaved(resultat) {
  //  if (resultat) {
  //    this._notifservice.success("Feuille de soin", "La feuille de soin a été correctement enregistrée !");
  //  }
  //  else {
  //    this._notifservice.error("Feuille de soin", "Un problème est survenue lors de l'enregistrement de la feuille de soin !");
  //  }
  //}

  //onFeuilleSoinValidated(reponse) {
  //  if (reponse.resultat) {
  //    if (reponse.consultation != null) {
  //      this.consultation.feuilleSoin = reponse.consultation.feuilleSoin;
  //    }
  //    this._notifservice.success("Feuille de soin", "La feuille de soin a été validée !");
  //  }
  //  else {
  //    this._notifservice.error("Feuille de soin", "Un problème est survenue lors de la validation de la feuille de soin !");
  //  }

  //  $('#closeModalFeuilleSoin').click();
  //}
}
