import { Component, OnInit } from '@angular/core';
import { CanvasSpace, Pt, Group, CanvasForm } from 'pts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pts-demo';
  space: CanvasSpace;
  form: CanvasForm;

  constructor() {

  }

  ngOnInit() {
    this.space = new CanvasSpace('#demo');
    this.space.setup({bgcolor: '#d3d3d3', retina: true, resize: true });
    this.form = this.space.getForm();
    this.space.add( () => this.form.point( this.space.pointer, 10));
    this.space.bindMouse().bindTouch().play();
  }

}
