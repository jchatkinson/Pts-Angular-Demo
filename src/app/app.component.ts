import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appTitle = 'pts-demo';

  components = [{
    title: 'Demo 1',
    url: '/demo/1',
  }, {
    title: 'Demo 2',
    url: '/demo/2',
  }];

  constructor() {

  }

  ngOnInit() {

  }
}
