import { Component, OnInit } from '@angular/core';
import { CanvasSpace, Pt, Group, CanvasForm, SVGSpace, SVGForm, Circle, Rectangle, Triangle, Curve, Num, PtLike } from 'pts';

@Component({
  selector: 'app-demo3',
  templateUrl: './demo3.component.html',
  styleUrls: ['./demo3.component.scss']
})
export class Demo3Component implements OnInit {
  space: CanvasSpace;
  form: CanvasForm;
  // space: SVGSpace;
  // form: SVGForm;
  nodes: INode[] = [];
  frames: IFrame[] = [];

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
        // let cycle = (off) => this.space.center.y * (Num.cycle((time + off) % 2000 / 2000) - 0.5);

        // this.circle = Circle.fromCenter(this.space.center.$add(0, cycle(0)), 30);
        // this.circle.moveBy(new Pt(0, cycle(0)));
        // this.rect = Rectangle.fromCenter(this.space.center.$add(cycle(1000), 0), 50);
        // this.rect.moveBy(cycle(1000), 0);
        // this.triangle = Triangle.fromCenter(this.space.center.$add(cycle(0) / 2, cycle(500)), 30);
        // this.triangle.moveBy(cycle(0) / 2, cycle(500));
        // this.curve = new Group(this.space.pointer, this.circle.p1, this.rect.p1, this.triangle.p1, this.space.pointer);

        this.form.stroke('#fff', 3)
        // this.form.fill('#ff6').circle(this.circle);
        // this.form.fill('#09f').rect(this.rect);
        // this.form.fill('#f03').polygon(this.triangle);
        // this.form.strokeOnly('#123', 5).polygon(Curve.cardinal(this.curve));
        // this.form.fillOnly('#124').point(this.space.pointer, 10, 'circle');
      }
    );
    this.space.play();
  }

  offsetText(p: Pt): Pt {
    // shift by 5px, -5px;
    let np = p.$add(5,-5);
    return np;
  }

  addPoint(x: Number, y: Number) {
    let pt = new Pt([x,y]);
    let labelpt = this.offsetText(pt);
    let label = this.nodes.push({coord: pt, dof: [1,1,1,1,1,1]}); //node id = position in array + 1

    this.space.add((time, ftime, space) => {
      this.form.point(pt, 5, 'circle');
      this.form.text(labelpt, String(label));  
    });
  }

  addFrame(i: Number, j: Number) {
    this.space.add((time, ftime, space) => {

    })
  }
}

export interface INode {
  coord: Pt;
  dof: Number[];
}

export interface IFrame {
  pts: Group;
  releases: Number[]; // a pair of booleans for frame releases [false, false]
}

