import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

declare const $: any;

@Component({
  selector: 'index',
  templateUrl: 'index.component.html',
  styleUrls: [
    'index.component.scss'
  ]
})
export class IndexComponent implements OnInit, OnDestroy {

  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
