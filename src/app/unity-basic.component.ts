import { Component, OnInit, ViewChild } from '@angular/core';

declare var UnityLoader: any;

@Component({
  selector: 'unity-basic',
  templateUrl: './unity-basic.component.html',
  styleUrls: []
})


export class UnityBasicComponent implements OnInit {
  @ViewChild("divForUnity") dfUnity;

  ngOnInit(): void {
		console.log("");
		console.log("UnityBasicComponent  init");
		console.log("");
		// if the global wasn't loaded, attempt to load
		var unity3dScript = document.createElement('script');      //add script attributes
		unity3dScript.async = true;
		unity3dScript.defer = true;
		unity3dScript.onload = (response) => {
			this.unityScriptWasLoaded()
		};
		unity3dScript.onerror = (response) => (console.log(response));
		unity3dScript.src = "assets/Build/UnityLoader.js";
		//load script directly on to DOM
		document.body.appendChild(unity3dScript);
  }

  unityScriptWasLoaded(): void {
    this.dfUnity.nativeElement.id = "unityPlayerDivContainer";
    var gameInstance = UnityLoader.instantiate("unityPlayerDivContainer", "assets/Build/Builds.json");
  }

}
