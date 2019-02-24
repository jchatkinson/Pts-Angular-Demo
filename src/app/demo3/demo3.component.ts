import { Component, OnInit } from '@angular/core';
import { CanvasSpace, Pt, Group, CanvasForm, SVGSpace, SVGForm, Circle, Rectangle, Triangle, Curve, Num, PtLike, UIHandler, UIButton, UI, UIDragger, GroupLike } from 'pts';

@Component({
  selector: 'app-demo3',
  templateUrl: './demo3.component.html',
  styleUrls: ['./demo3.component.scss']
})
export class Demo3Component implements OnInit {
  space: CanvasSpace;
  form: CanvasForm;
  nodes: CNode[] = [];
  frames: CFrame[] = [];
  rad = 5;
  hovOn: UIHandler = (ui) => ui.group.scale(3, ui.group.centroid());
  hovOff: UIHandler = (ui) => ui.group.scale(1 / 3, ui.group.centroid());

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


    this.space.add({
      start: (bound, space) => {

      },
      animate: (time: number, ftime: number) => {
        this.nodes.forEach( n => {
          n.render(g => this.form.circle(g));
        });
        this.frames.forEach( f => {
          this.form.line([f.i.group.centroid(), f.j.group.centroid()]);
        });
      },
      action: (type: string, px: number, py: number) => {
        UI.track(this.nodes, type, new Pt(px, py));
      }, 
      resize: (bound, event) => {
        if (this.form.ready) {
          console.log('resized');
        }        
      }
    });
    this.space.play();
  }

  offsetText(p: Pt): Pt {
    // shift by 5px, -5px;
    return p.$add(5, -5);
  }

  addPoint(x: Number, y: Number) {
    let len = this.nodes.push(
      new CNode([new Pt([x, y]), new Pt([10, 10])],'circle',{})
    )
    this.nodes[len-1].onClick(ui => console.log('clicked'))
    this.nodes[len-1].onHover(this.hovOn, this.hovOff)
  }

  addFrame(i: number, j: number) {
    this.frames.push(new CFrame(this.nodes[i - 1], this.nodes[j - 1]));
  }
}

export class CNode extends UIButton {
  dof: Number[];
  constructor(group: GroupLike, shape:string, states:{[key:string]: any}={}, dof: Number[]=[1,1,1,1,1,1], id?:string) {
    super(group, shape, states, id);
    this.dof = dof;
  }
}

export class CFrame {
  i: CNode; // start node
  j: CNode; // end node
  releases?: Number[] = [0, 0]; // a pair of 0/1 for frame releases
  E?: Number;
  G?: Number;
  A?: Number;
  Iz?: Number;
  Iy?: Number;
  J?: Number;

  constructor(i: CNode, j: CNode, releases?: Number[] , E?: Number, G?: Number, A?: Number, Iz?: Number, Iy?: Number, J?: Number) {
    this.i = i;
    this.j = j;
    this.releases = releases;
  }

  length(): Number {
    return this.i.group.centroid().$subtract(this.j.group.centroid()).magnitude();
  }
}

