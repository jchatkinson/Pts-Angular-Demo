import { Component, OnInit } from '@angular/core';
import { CanvasSpace, Pt, Group, CanvasForm, SVGSpace, SVGForm, Circle, Rectangle, Triangle, Curve, Num } from 'pts';

@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss']
})
export class Demo1Component implements OnInit {
  space: CanvasSpace;
  form: CanvasForm;
  // space: SVGSpace;
  // form: SVGForm;
  circle: Group;
  rect: Group;
  triangle: Group;
  curve: Group;

  constructor() {

  }

  ngOnInit() {
    this.setupSpace();
    this.setupForm();
    this.setupPoints();
  }

  // Space is the paper
  setupSpace() {
    this.space = new CanvasSpace('#demo');
    // this.space = new SVGSpace('#demo');
    this.space.setup({ bgcolor: '#d3d3d3', resize: true });
  }
  // Form is the pencil
  setupForm() {
    this.form = this.space.getForm();
  }

  // Points are the idea
  setupPoints() {
    this.space.add(
      (time, ftime, space) => {
        let cycle = (off) => this.space.center.y * (Num.cycle((time + off) % 2000 / 2000) - 0.5);

        this.circle = Circle.fromCenter(this.space.center.$add(0, cycle(0)), 30);
        // this.circle.moveBy(new Pt(0, cycle(0)));
        this.rect = Rectangle.fromCenter(this.space.center.$add(cycle(1000), 0), 50);
        // this.rect.moveBy(cycle(1000), 0);
        this.triangle = Triangle.fromCenter(this.space.center.$add(cycle(0) / 2, cycle(500)), 30);
        // this.triangle.moveBy(cycle(0) / 2, cycle(500));
        this.curve = new Group(this.space.pointer, this.circle.p1, this.rect.p1, this.triangle.p1, this.space.pointer);

        this.form.stroke('#fff', 3)
        this.form.fill('#ff6').circle(this.circle);
        this.form.fill('#09f').rect(this.rect);
        this.form.fill('#f03').polygon(this.triangle);
        this.form.strokeOnly('#123', 5).polygon(Curve.cardinal(this.curve));
        this.form.fillOnly('#124').point(this.space.pointer, 10, 'circle');
      }
    );
    this.space.play().bindMouse();
  }
}