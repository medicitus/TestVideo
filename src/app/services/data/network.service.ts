import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {Http} from "@angular/http";

declare const $;

@Injectable()
export class NetworkService {

  imageAddr = "/assets/img/ballon.jpg";
  downloadSize = 400384; //bytes

  start;

  network = null;

  // Observable string sources
  private networkChangedSource = new Subject<NetworkType>();

  // Observable string streams
  networkChange$ = this.networkChangedSource.asObservable();

  constructor() {
  }

  //getNetwork(force?: boolean) {
  //  if(this.network==null || (force!=null && force)) {
  //    let that = this;
  //    this.start = new Date().getTime();

  //    $.ajax({
  //      url: this.urlService.siteUrl + this.imageAddr + '?t=' + Math.random(),
  //      method: 'get'
  //    }).success(function () {
  //      let ms = new Date().getTime() - that.start;
  //      let oPerSec = that.downloadSize / ms * 1000;
  //      let MoPerSec = oPerSec / 1024 / 1024;
  //      // console.log('downloaded 391 Ko in ' + ms + ' milliseconds');
  //      // console.log('DL ' + MoPerSec + ' Mo/s');
  //      // console.log('Réseau ' + (MoPerSec * 8) + ' Mb/s');
  //      that.network = new NetworkType();
  //      that.network.setMbPerSec(MoPerSec * 8);
  //      that.networkChangedSource.next(that.network);
  //    });
  //  } else {
  //    this.networkChangedSource.next(this.network);
  //  }
  //}

}

export class NetworkType {
  mbPerSec;

  width;

  height;

  type;

  public setMbPerSec(mbPerSec) {
    this.mbPerSec = mbPerSec;

    if(mbPerSec<0.45) {
      this.height = 240;
      this.width = 320;
      this.type = '2g';
    } else if(mbPerSec<2) {
      this.height = 480;
      this.width = 640;
      this.type = '3g';
    } else {
      this.height = 480;
      this.width = 640;
      this.type = 'wifi';
    }

  }
}
