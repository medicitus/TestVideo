import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { UrlService } from "../url.service";
import { Http } from "@angular/http";
//import { HttpMedicitusService } from "../http-medicitus.service";

declare const $;

@Injectable()
export class XirsysService {

  constructor(private urlService: UrlService, private http: Http) {
    //super();
  }

  getXirsysUrls(): Observable<any> {
    return this.http.get(this.urlService.getXirsysUrl())
      .map(res => {
        return res.json;
      })
      //.catch(this.handleError);
  }

}
