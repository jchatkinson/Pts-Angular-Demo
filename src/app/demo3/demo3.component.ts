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
  nodes: UIButton[] = [];
  frames: CFrame[] = [];
  rad = 5;
  hovOn: UIHandler = (ui) => ui.group[1].scale(3);
  hovOff: UIHandler = (ui) => ui.group[1].scale(1 / 3);

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
          n.render(g => this.form.fillOnly("#f06").circle(g));
        });
        this.frames.forEach( f => {
          this.form.stroke('black',2)
          this.form.line([f.i.group[0], f.j.group[0]]);
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
    this.space.bindMouse().play();
  }

  offsetText(p: Pt): Pt {
    // shift by 5px, -5px;
    return p.$add(5, -5);
  }

  addPoint(x: Number, y: Number) {
    let g = Circle.fromCenter(new Pt([x, y]), this.rad);
    let len = this.nodes.push(
      new UIButton(g,'circle',{})
    )
    this.nodes[len-1].onClick(ui => console.log('clicked'))
    this.nodes[len-1].onHover(this.hovOn, this.hovOff)
    console.log(g)
  }

  addFrame(i: number, j: number) {
    if (this.nodes.length >= Math.max(i,j)) {
      this.frames.push(new CFrame(this.nodes[i - 1], this.nodes[j - 1]));
    } else {
      console.log('invalid node')
    }
  }
}

// export class CNode extends UIButton {
//   constructor(group: GroupLike, shape: string, states?: {[key: string]: any;}, id?: string){
//     super(group, shape, states, id)
//   };
// }

export class CFrame {
  i: UIButton; // start node
  j: UIButton; // end node
  releases?: Number[] = [0, 0]; // a pair of 0/1 for frame releases
  E?: Number;
  G?: Number;
  A?: Number;
  Iz?: Number;
  Iy?: Number;
  J?: Number;

  constructor(i: UIButton, j: UIButton, releases?: Number[] , E?: Number, G?: Number, A?: Number, Iz?: Number, Iy?: Number, J?: Number) {
    this.i = i;
    this.j = j;
    this.releases = releases;
  }

  length(): Number {
    return this.i.group.centroid().$subtract(this.j.group.centroid()).magnitude();
  }
}

