import { Component, OnInit } from '@angular/core';
import { CanvasSpace, Pt, Group, CanvasForm, SVGSpace, SVGForm, Circle, Rectangle, Triangle, Curve, Num, PtLike } from 'pts';

@Component({
  selector: 'app-demo4',
  templateUrl: './demo4.component.html',
  styleUrls: ['./demo4.component.scss']
})
export class Demo4Component implements OnInit {
  space: CanvasSpace;
  form: CanvasForm;
  // space: SVGSpace;
  // form: SVGForm;
  nodes: INode[] = [];
  frames: cFrame[] = [];

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
    let label = this.nodes.length+1;
    label = this.nodes.push({label: label, pt: pt, dof: [1,1,1,1,1,1]}); //node id = position in array + 1

    this.space.add((time, ftime, space) => {
      this.form.point(pt, 5, 'circle');
      this.form.text(labelpt, String(label));  
    });
  }

  drawFrame(i: number, j: number) {
    console.log(this.nodes)
    let pti = this.nodes[i-1].pt; 
    let ptj = this.nodes[j-1].pt; 

    if(pti && ptj) {
      this.space.add((time, ftime, space) => {
        this.form.line([pti, ptj])
      })
    }

  }
}

export interface INode {
  label: Number;
  pt: Pt;
  dof: Number[];
};

export class cFrame {
  i: INode; //start node
  j: INode; //end node
  releases: Number[]; // a pair of booleans for frame releases [false, false]
  E: Number;
  G: Number;
  A: Number;
  Iz: Number;
  Iy: Number;
  J: Number;

  constructor(Nodei: INode, Nodej: INode, releases: Number[] = [0, 0], E: Number, G:Number, A:Number, Iz:Number, Iy:Number,J:Number ) {
    this.i = Nodei;
    this.j = Nodej;
    this.releases = releases;
  }

  length(): Number {
    return this.i.pt.$subtract(this.j.pt).magnitude();
  }
}

