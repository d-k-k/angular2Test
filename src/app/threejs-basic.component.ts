import { Component, OnInit, ViewChild } from '@angular/core';

import { AppComponent } from './app.component';
import { SendService } from './send.service';

declare var THREE: any;

@Component({
  selector: 'threejs-basic',
  templateUrl: './threejs-basic.component.html',
  styleUrls: ['./threejs-basic.component.css']
})
export class ThreejsBasicComponent implements OnInit {

  @ViewChild("threejsContainer") threejsc;

  width = 100;
  height = 100;
  nearClip = 0.1;
  farClip = 1000;
  scene: any;
  camera: any;
  renderer: any;
  containerToPutView:any;
  cube: any;

  failSafe = 3;
  parent: AppComponent;


  constructor(
    private send: SendService) { }

  ngOnInit(): void {
  }

  specifySize(w, h): void {
    this.width = w;
    this.height = h;

		console.log("");
		console.log("ThreejsBasicComponent  init");
		console.log("");
		// if the global wasn't loaded, attempt to load
		var threejsScript = document.createElement('script');      //add script attributes
		threejsScript.async = true;
		threejsScript.defer = true;
		threejsScript.onload = (response) => {
			this.showThreejsSceneBox()
		};
		threejsScript.onerror = (response) => (console.log(response));
		threejsScript.src = "assets/js/three.js";
		//load script directly on to DOM
		document.body.appendChild(threejsScript);
  }

  showThreejsSceneBox(): void {
    if (this.threejsc === undefined) {
      this.failSafe--;
      console.log("Threejs component not ready yet");
      console.dir(this);
      if (this.failSafe > 0) {
        setTimeout(() => {
          this.specifySize(this.width, this.height);
        }, 500);
      } else {
        console.log("failSafe triggered to prevent looping");
      }
      return;
    }
    console.log("Loading threejs");
    // for now stack everything here
    this.scene = new THREE.Scene();
    //                                      FOV,    aspect ratio,                     clip near, far
    this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( this.width, this.height );
    // for now assume there is only one
    // this.containerToPutView = document.getElementById("threejsContainer");
    // this.containerToPutView.appendChild(this.renderer.domElement);
    // plops the renderer in the middle of everything
    //document.body.appendChild( this.renderer.domElement );
    this.threejsc.nativeElement.appendChild(this.renderer.domElement);
    this.threejsc.nativeElement.extra = 5;
    console.dir(this.threejsc);

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );

    this.camera.position.z = 5;
    this.renderer.render(this.scene, this.camera);

    this.render();
  }

  render(): void {
    var _this = this;
    // window.requestAnimationFrame( () => {this.render()} );
    window.requestAnimationFrame( function() { _this.render(); } );
    this.renderer.render( this.scene, this.camera );
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
  }

  setParent(p: AppComponent): void {
    this.parent = p;
    console.log("--------");
    console.log("Parent set");
    console.dir(this.parent);
    console.log("Does it match what is in send?");
    console.dir(this.send.getAc());
    console.log("Giving self to send");
    this.send.setTjs(this);
    console.log("--------");
  }
}
