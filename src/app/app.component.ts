import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';

import { ThreejsBasicComponent } from './threejs-basic.component';
import { SendService } from './send.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  @ViewChild("divForThreejs") df3js;
  @ViewChild(ThreejsBasicComponent) tjsComponent;
  title = 'for google maps, threejs, unity, d3, semantic-ui';

  identifyIfSameInSend = "originalValue";

  constructor(
    private threejsView: ThreejsBasicComponent,
    private send: SendService) { }

  ngOnInit(): void {
    // console.log("Value of df3js:" + this.df3js);
    // console.dir(this.df3js);
    // console.log("Width:" + this.df3js.nativeElement.style.width);
    // console.log("Height:" + this.df3js.nativeElement.style.height);
    // this.threejsView.specifySize(
    //     parseInt(this.df3js.nativeElement.style.width), // width
    //     parseInt(this.df3js.nativeElement.style.height)); // height
  }

  ngAfterContentInit(): void {
    this.identifyIfSameInSend = "differentValue";
    this.send.setAc(this);
    // console.log("Value of df3js:" + this.df3js);
    // console.dir(this.df3js);
    // console.log("Width:" + this.df3js.nativeElement.style.width);
    // console.log("Height:" + this.df3js.nativeElement.style.height);
    var w = parseInt(this.df3js.nativeElement.clientWidth);
    var h = parseInt(this.df3js.nativeElement.clientHeight);
    console.log("Trying to pass: " + w + "," + h);
    this.tjsComponent.specifySize(w,h);
    this.tjsComponent.setParent(this);

    console.dir(this.send.getTjs());

  }


}
