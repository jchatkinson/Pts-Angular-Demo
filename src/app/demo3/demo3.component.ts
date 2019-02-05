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
  frames: CFrame[] = [];

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
        this.nodes.forEach( n => {
          this.form.point(n.pt, 5, 'circle');
          this.form.text(this.offsetText(n.pt), String(n.label));
        });
        this.frames.forEach( f => {
          this.form.line([f.i.pt, f.j.pt]);
        });
      }
    );
    this.space.play();
  }

  offsetText(p: Pt): Pt {
    // shift by 5px, -5px;
    return p.$add(5, -5);
  }

  addPoint(x: Number, y: Number) {
    const pt = new Pt([x, y]);
    let label = this.nodes.length + 1;
    label = this.nodes.push({label: label, pt: pt, dof: [1, 1, 1, 1, 1, 1]}); // node id = position in array + 1
  }

  addFrame(i: number, j: number) {
    this.frames.push(new CFrame(this.nodes[i - 1], this.nodes[j - 1]));
  }
}

export interface INode {
  label: Number;
  pt: Pt;
  dof: Number[];
}

export class CFrame {
  i: INode; // start node
  j: INode; // end node
  releases?: Number[] = [0, 0]; // a pair of 0/1 for frame releases
  E?: Number;
  G?: Number;
  A?: Number;
  Iz?: Number;
  Iy?: Number;
  J?: Number;

  constructor(i: INode, j: INode, releases?: Number[] , E?: Number, G?: Number, A?: Number, Iz?: Number, Iy?: Number, J?: Number) {
    this.i = i;
    this.j = j;
    this.releases = releases;
  }

  length(): Number {
    return this.i.pt.$subtract(this.j.pt).magnitude();
  }
}

