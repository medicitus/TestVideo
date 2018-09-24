import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

declare const $: any;

@Component({
  selector: 'nav-bar',
  templateUrl: 'nav-bar.component.html',
  styleUrls: [
    'nav-bar.component.scss'
  ]
})
export class NavBarComponent implements OnInit, OnDestroy {


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  constructor(private router: Router) {
  }
}
