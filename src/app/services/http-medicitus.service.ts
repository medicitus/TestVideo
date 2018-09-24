import {Observable} from "rxjs";
import { Response, RequestOptions, ResponseContentType, Headers} from "@angular/http";

export class HttpMedicitusService {
  
  constructor() {

  }

  protected extractData(res: Response) {
    // On sauvegarde le dernier appel à ids pour pouvoir calculer la fin de session
    var lastAction = new Date();
    localStorage.setItem("lastActionTime", lastAction.getTime().toString());
    localStorage.setItem("lastAction", lastAction.toLocaleString());

    return res.json();
  }

  protected extractText(res: Response) {
    return res.text();
  }

  protected handleError(error: Response) {
    console.log("httpmedicitus error");
    console.log(error);
    return Observable.throw(error.json());
  }

  protected setHeaders(contentType = null, responseType = null) {

    let opt: RequestOptions;

    if (contentType == null) {
      contentType = 'application/x-www-form-urlencoded';
    }

    if (contentType != 'none') {
      let myHeaders: Headers = new Headers({ 'Content-Type': contentType }); // ... Set content type to JSON
      opt = new RequestOptions({ headers: myHeaders, withCredentials: true });
    }
    else {
      opt = new RequestOptions({ withCredentials: true });
    }

    if (responseType != null) {
      opt.responseType = ResponseContentType.ArrayBuffer;
    }

    return opt;
  }
}
