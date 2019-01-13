import { Component, OnInit } from '@angular/core';
import { CanvasSpace, Pt, Group, CanvasForm, SVGSpace, SVGForm, Circle, Rectangle, Triangle, Curve, Num } from 'pts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pts-demo';
  // space: CanvasSpace;
  // form: CanvasForm;
  space: SVGSpace;
  form: SVGForm;

  constructor() {

  }

  ngOnInit() {
    this.setupSpace();
    this.setupForm();
    this.setupPoints();
  }

  // Space is the paper
  setupSpace() {
    // this.space = new CanvasSpace('#demo');
    this.space = new SVGSpace('#demo');
    this.space.setup({bgcolor: '#d3d3d3', resize: true });
  }
  // Form is the pencil
  setupForm() {
    this.form = this.space.getForm();
  }

  // Points are the idea
  setupPoints() {
    this.space.add( (time, ftime) => {
      const cycle = (off) => this.space.center.y * ( Num.cycle( (time + off) % 2000 / 2000 ) - 0.5 );

      const circle = Circle.fromCenter( this.space.center.$add( 0, cycle(0) ), 30 );
      const rect = Rectangle.fromCenter( this.space.center.$add( cycle(1000), 0 ), 50 );
      const triangle = Triangle.fromCenter( this.space.center.$add( cycle(0)/2, cycle(500) ), 30 );
      const curve = new Group( this.space.pointer, circle.p1, rect.p1, triangle.p1, this.space.pointer );

      this.form.stroke('#fff', 3)
      this.form.fill('#ff6').circle( circle );
      this.form.fill('#09f').rect( rect );
      this.form.fill('#f03').polygon( triangle );
      this.form.strokeOnly('#123', 5).polygon( Curve.cardinal( curve ) );
      this.form.fillOnly('#124').point( this.space.pointer, 10, 'circle' );
    });

    this.space.play().bindMouse().bindTouch();
  }

}
