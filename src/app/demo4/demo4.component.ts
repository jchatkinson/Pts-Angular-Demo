import { Component, OnInit } from '@angular/core';
import { CanvasSpace, Pt, Group, CanvasForm, UIButton, UIDragger, UI, Rectangle, Curve, Num, Line, Const, UIHandler, Space, Form } from 'pts';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-demo4',
  templateUrl: './demo4.component.html',
  styleUrls: ['./demo4.component.scss']
})
export class Demo4Component implements OnInit {
  space: CanvasSpace;
  form: CanvasForm;

  constructor(public dialog: MatDialog) {

  }

  ngOnInit() {
    this.setupSpace();
    this.setupForm();
    this.setupPoints(this.space, this.form);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {name: 'Jeremy', animal: 'tiger'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // Space is the paper
  setupSpace() {
    this.space = new CanvasSpace('#demo');
    this.space.setup({ bgcolor: '#d3d3d3', resize: true });
  }
  // Form is the pencil
  setupForm() {
    this.form = this.space.getForm();
  }
  // Points are the idea
  setupPoints(space, form) {
    var handles: UIDragger[];
    var firstPt: UIButton, lastPt: UIButton;
    var tension = 0.5;
    var prev: number;
    var ang = 0;

    space.add({

      start: (bound, space) => {
        let hs = Line.subpoints([space.center.$multiply(0.25), space.center.$add(space.center.$multiply(0.75))], 5);

        // convert points to UIs
        handles = hs.map(h => {
          let ud = UIDragger.fromCircle([h, new Pt([10, 10])], {}) as UIDragger;

          ud.onDrag((ui, pt) => { // drag handling
            ui.group[0].to(space.pointer.$subtract(ui.state('offset')))
          });

          ud.onHover( // hover handling
            (ui) => ui.group[1].scale(2),
            (ui) => ui.group[1].scale(1 / 2),
          )
          return ud;
        });

        let hovOn: UIHandler = (ui) => ui.group.scale(3, ui.group.centroid());
        let hovOff: UIHandler = (ui) => ui.group.scale(1 / 3, ui.group.centroid());

        firstPt = UIButton.fromPolygon(Group.fromArray([[0, space.center.y - 30], [0, space.center.y + 30], [30, space.center.y]]), {}) as UIButton;
        firstPt.onClick(ui => { 
          tension = Math.max(0.1, tension - 0.1);
          this.openDialog();
        });
        firstPt.onHover(hovOn, hovOff);

        lastPt = UIButton.fromPolygon(Group.fromArray([[space.width, space.center.y - 30], [space.width, space.center.y + 30], [space.width - 30, space.center.y]]), {}) as UIButton;
        lastPt.onClick(ui => { tension = Math.min(2, tension + 0.1) });
        lastPt.onHover(hovOn, hovOff);

      },

      animate: (time: number, ftime: number) => {

        let ctrls = handles.map(g => g.group[0]);
        ctrls.unshift(firstPt.group[2]);
        ctrls.push(lastPt.group[2]);

        let curve = Curve.cardinal(ctrls, 15, tension);
        curve.unshift(firstPt.group[0]);
        curve.unshift(new Pt(0, 0));
        curve.push(lastPt.group[0]);
        curve.push(new Pt(space.size.x, 0));

        let t = Num.cycle((time % 5000) / 5000);

        // get current curve point and angle
        let ci = 2 + Math.floor(t * (curve.length - 4));
        if (prev !== undefined && !curve[ci].equals(curve[prev])) {
          ang = curve[ci].$subtract(curve[prev]).angle() + Const.quarter_pi;
        }
        prev = ci;

        form.fillOnly("#f06");
        handles.forEach(h => h.render(g => form.circle(g)));

        form.fillOnly("rgba(0,0,50,.8)").line(curve);

        let rect = Rectangle.corners(Rectangle.fromCenter(curve[ci], 20)).rotate2D(ang, curve[ci]);
        form.strokeOnly("#fff", 7).lines([[rect[0], rect[2]], [rect[1], rect[3]]]);

        firstPt.render(g => form.fillOnly("#fe3").polygon(g));
        lastPt.render(g => form.fillOnly("#0c6").polygon(g));

      },

      action: (type: string, px: number, py: number) => {
        UI.track(handles, type, new Pt(px, py));
        UI.track([firstPt, lastPt], type, new Pt(px, py));
      },

      resize: (bound, evt) => {
        if (form.ready) {
          firstPt.group = Group.fromArray([[0, space.center.y - 30], [0, space.center.y + 30], [30, space.center.y]]);
          lastPt.group = Group.fromArray([[space.width, space.center.y - 30], [space.width, space.center.y + 30], [space.width - 30, space.center.y]]);
        }
      }
    });

    //// ----
    space.bindMouse().bindTouch().play();
  }
}
