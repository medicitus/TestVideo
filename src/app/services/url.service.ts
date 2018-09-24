import { Injectable } from "@angular/core";

@Injectable()
export class UrlService {

 
  baseUrl: string;
  siteUrl: string;

  constructor() {
      this.baseUrl = 'http://10.42.63.151:5000';
      this.siteUrl = 'http://10.42.63.151:4200';
  }

  getAudioFileTestUrl() {
    return this.siteUrl + '/assets/media/test_audio_medicitus.mp3';
  }

  getConsultationsUrl() {
    return this.baseUrl + '/consultations';
  }

  getConsultationsByDatesUrl(dtDeb: number, dtFin: number) {
    return this.baseUrl + '/consultations/dates/' + dtDeb + '/' + dtFin;
  }

  getConsultationUrl(consultationId: string) {
    return this.getConsultationsUrl() + '/' + consultationId;
  }

  getConsultationByRdvUrl(rdvId: string) {
    return this.getConsultationsUrl() + '/rdv/' + rdvId;
  }

  getCreateConsultationUrl() {
    return this.getConsultationsUrl();
  }

  getUpdateConsultationUrl(consultationId: string) {
    return this.getConsultationsUrl() + '/' + consultationId;
  }

  getConsultationNotifyMedUrl() {
    return this.baseUrl + '/notifymedconsult';
  }

  getSavePaymentTokenConsultationUrl() {
    return this.getConsultationsUrl() + '/savePaymentToken';
  }

  getPrescriptionsUrl() {
    return this.baseUrl + '/prescriptions';
  }

  getPrescriptionUrl(prescId: string) {
    return this.baseUrl + '/prescriptions/' + prescId;
  }

  getPrescriptionByNumUrl(num: string) {
    return this.baseUrl + '/prescriptions/num/' + num;
  }

  getPrescriptionByConsultUrl(consultationId: string) {
    return this.getConsultationUrl(consultationId) + '/prescription';
  }

  getPrescriptionsByConsultUrl(consultationId: string) {
    return this.getConsultationUrl(consultationId) + '/prescriptions';
  }

  getPrescExaByConsultUrl(consultationId: string) {
    return this.getConsultationUrl(consultationId) + '/prescexa';
  }

  getGenerateFeuilleSoinUrl() {
    return this.getConsultationsUrl() + '/generateFeuilleSoin';
  }

  getSaveFeuilleSoinUrl(consultationId) {
    return this.getConsultationUrl(consultationId) + '/saveFeuilleSoin';
  }

  getCreatePrescriptionUrl() {
    return this.getPrescriptionsUrl();
  }

  getUpdatePrescriptionUrl(prescriptionId: string) {
    return this.getPrescriptionsUrl() + '/' + prescriptionId;
  }

  getUpdatePrescExaUrl(prescriptionId: string) {
    return this.getPrescriptionsUrl() + 'exa/' + prescriptionId;
  }

  getCompteRendusUrl() {
    return this.baseUrl + '/compteRendus/';
  }

  getCompteRenduUrl(crId: string) {
    return this.getCompteRendusUrl() + '/' + crId;
  }

  getCompteRenduByConsultUrl(consultId: string) {
    return this.getConsultationsUrl() + '/' + consultId + '/compteRendu';
  }

  getUpdateCompteRenduUrl(crId: string) {
    return this.baseUrl + '/compteRendus/' + crId;
  }

  getDossierCompteRenduByPatientUrl(patientId: string) {
    return this.baseUrl + '/compteRendus/dossier/' + patientId;
  }

  getDossierCompteRenduByConsultUrl(consultId) {
    return this.baseUrl + '/consultations/' + consultId + '/compteRenduPDF';
  }

  getRdvsUrl() {
    return this.baseUrl + '/rdvs';
  }

  getRdvUrl(rdvId: string) {
    return this.getRdvsUrl() + '/' + rdvId;
  }

  getRdvByDateUrl(dtDeb: number, dtFin: number) {
    return this.getRdvsUrl() + '/dates/' + dtDeb + '/' + dtFin;
  }


  getRdvMedByStatusUrl(docId: string, status: number) {
    return this.getRdvsUrl() + '/med/' + docId + '/status/' + status;
  }

  getRdvMedByDateUrl(docId: string, dtDeb: number, dtFin: number) {
    return this.getRdvsUrl() + '/med/' + docId + '/dates/' + dtDeb + '/' + dtFin;
  }

  getRdvPatientByDateUrl(patId: string, dtDeb: number, dtFin: number) {
    return this.getRdvsUrl() + '/patient/' + patId + '/dates/' + dtDeb + '/' + dtFin;
  }

  getSlotRdvUrl(spe: string, dtDeb: number, dtFin: number) {
    return this.getRdvsUrl() + '/findslot/' + spe + '/' + dtDeb + '/' + dtFin;
  }

  getBookSlotRdvUrl(rdvId: string) {
    return this.getRdvsUrl() + '/book/' + rdvId;
  }

  getUnBookSlotRdvUrl(rdvId: string) {
    return this.getRdvsUrl() + '/unbook/' + rdvId;
  }

  getRefuseSlotRdvUrl(rdvId: string) {
    return this.getRdvsUrl() + '/refuse/' + rdvId;
  }

  getMedecinsUrl() {
    return this.baseUrl + '/medecins'
  }

  getMedecinUrl(medecinId: string) {
    return this.getMedecinsUrl() + '/' + medecinId;
  }

  getUpdateMedecinUrl(medecinId: string) {
    return this.getMedecinsUrl() + '/' + medecinId;
  }

  getCreateMedecinUrl() {
    return this.getMedecinsUrl() + '/create/medecin';
  }

  getMedecinConsultationsUrl(medecinId: string) {
    return this.getMedecinUrl(medecinId) + '/consultations';
  }

  getConsultationsByMedecinDateUrl(medecinId: string, dtDeb: number, dtFin: number) {
    return this.getMedecinUrl(medecinId) + '/consultations/dates/' + dtDeb + '/' + dtFin;
  }

  getMedecinConsultationsToCloseUrl(medecinId: string) {
    return this.getMedecinUrl(medecinId) + '/consultationstoclose';
  }

  getMedecinNbConsultToCloseUrl(medecinId: string) {
    return this.getMedecinUrl(medecinId) + '/nbconsulttoclose';
  }

  getRPPSusersByNomCPUrl(nom, cp) {
    return this.baseUrl + '/getRPPSusers/' + nom + '/' + cp;
  }

  getRPPSusersByRPPSUrl(rpps) {
    return this.baseUrl + '/getRPPSusers/' + rpps;
  }

  getPatientsUrl() {
    return this.baseUrl + '/patients'
  }

  getEnrollPatientUrl() {
    return this.baseUrl + '/enrollPatient'
  }

  getEnrollMedecinUrl() {
    return this.baseUrl + '/enrollMedecin'
  }

  getPatientUrl(patientId: string) {
    return this.getPatientsUrl() + '/' + patientId;
  }

  getPatientDonneesSanteUrl(patientId: string) {
    return this.getPatientUrl(patientId) + '/donneesSantes';
  }

  getPatientConsultationsUrl(patientId: string) {
    return this.getPatientUrl(patientId) + '/consultations';
  }

  getPatientUpdateNokiaInfos(patientId: string) {
    return this.getPatientUrl(patientId) + '/nokiaAPI/updateNokiaInfos';
  }

  getPatientNokiaAPIUrl(patientId: string) {
    return this.getPatientUrl(patientId) + '/nokiaAPI/getUrlLiaison';
  }

  getPatientNokiaAPITokenData(patientId: string, userId: string, auth_token: string, oauth_token_secret: string) {
    return this.getPatientUrl(patientId) + '/nokiaAPI/getTokenData/' + userId + '/' + auth_token + '/' + oauth_token_secret;
  }

  getPatientNokiaAPIData(patientId: string, userId: string, auth_token: string, oauth_token_secret: string) {
    return this.getPatientUrl(patientId) + '/nokiaAPI/getData/' + userId + '/' + auth_token + '/' + oauth_token_secret;
  }

  getStripeAPIDoPaymentUrl() {
    return this.baseUrl + '/stripe/charges';
  }

  getStripeAPICapturePaymentUrl() {
    return this.baseUrl + '/stripe/capturePayment';
  }

  getStripeAPIRefundPaymentUrl() {
    return this.baseUrl + '/stripe/refundPayment';
  }

  getDocUrl(docId: string) {
    return this.baseUrl + '/docs/' + docId;
  }

  getDeleteDocUrl(docId: string) {
    return this.baseUrl + '/docs/' + docId;
  }

  getUserUrl() {
    return this.baseUrl + '/user';
  }

  getUserCGUUrl(userId: string) {
    return this.baseUrl + '/users/' + userId + '/cgu';
  }

  getUpdateSecretHandleUrl() {
    return this.baseUrl + '/users/updateSecretHandle';
  }

  getUserLostPasswordUrl() {
    return this.baseUrl + '/lost-password-requested';
  }

  getChangePasswordUrl(userId: string) {
    return this.baseUrl + '/users/' + userId + '/changepassword';
  }

  getAutologonUrl(loginUser: String) {
    return this.baseUrl + '/autologon/' + loginUser;
  }
  
  getAvatarUrl(userId: string) {
    return this.baseUrl + '/users/' + userId + '/avatar';
  }

  getDeconnexionUrl() {
    return this.baseUrl + '/disconnect'
  }

  getextLogUrl(patientId: string) {
    return this.baseUrl + '/logLines/' + patientId;
  }

  geLogPageUrl() {
    return this.baseUrl + '/logPage';
  }

  getInfoUrl() {
    return this.baseUrl + '/infos/';
  }

  getSendSmsUrl() {
    return this.baseUrl + '/sms';
  }

  getInfoByFilterUrl(userid: string, profil: string) {
    return this.baseUrl + '/infos/' + profil + '/' + userid;
  }

  getUserFromTokenUrl(token: string) {
    return this.getUserUrl() + '/token/' + token;
  }

  getStatsUrl() {
    return this.baseUrl + '/stats';
  }

  getStatsNbPatientsUrl() {
    return this.getStatsUrl() + '/nbpatients';
  }

  getStatsNbDoctorsUrl() {
    return this.getStatsUrl() + '/nbdoctors';
  }

  getXirsysUrl() {
    return this.baseUrl + '/xirsys';
  }

  getSendMailUrl() {
    return this.baseUrl + '/sendMail';
  }

  getDebugUrl() {
    return this.baseUrl + '/debug';
  }

  getRecordAudioUrl() {
    return this.baseUrl + '/recordAudio';
  }

  getTarifsUrl() {
    return this.baseUrl + '/tarifs';
  }

  getTarifsByMedecinUrl(medecinId) {
    return this.baseUrl + '/tarifs/' + medecinId;
  }

  getTarifsByMedecinSpecialiteUrl(medecinId, specialiteCode) {
    return this.baseUrl + '/tarifs/' + medecinId + '/' + specialiteCode;
  }

  getUpdateTarifsForMedecinUrl(medecinId) {
    return this.baseUrl + '/tarifs/' + medecinId;
  }

  getPartenairesUrl() {
    return this.baseUrl + '/partenaires';
  }

  getPartenaireUrl(partenaireId) {
    return this.baseUrl + '/partenaire/' + partenaireId;
  }
}
