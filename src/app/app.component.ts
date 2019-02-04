import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appTitle = 'pts-demo';

  components = [{
    title: 'Demo 1',
    url: '/demo/1',
  }, {
    title: 'Demo 2',
    url: '/demo/2',
  }, {
    title: 'Demo 3',
    url: '/demo/3',
  },{
    title: 'Demo 4',
    url: '/demo/4'
  }];

  constructor(private breakpointObserver: BreakpointObserver) {

  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
}
