import { Component, OnInit, ViewChild } from '@angular/core';

declare var SAGE2Connection: any;

@Component({
  selector: 'sage2ws',
  templateUrl: './sage2ws.component.html',
  styleUrls: []
})


export class Sage2wsComponent implements OnInit {
  @ViewChild("divForSage2Status") dfSage2;

  ngOnInit(): void {
		console.log("");
		console.log("Sage2wsComponent  init");
		console.log("");
		// if the global wasn't loaded, attempt to load
		var s2cScript = document.createElement('script');      //add script attributes
		s2cScript.async = true;
		s2cScript.defer = true;
		s2cScript.onload = (response) => {
			this.sage2ConnectionScriptLoaded()
		};
		s2cScript.onerror = (response) => (console.log(response));
		s2cScript.src = "assets/js/SAGE2_standAlonePageConnectBack.js";
		//load script directly on to DOM
		document.body.appendChild(s2cScript);
  }

  sage2ConnectionScriptLoaded(): void {
    this.dfSage2.nativeElement.id = "sage2StatusDiv";
    this.dfSage2.nativeElement.innerHTML = "Will attempt connection to SAGE2...\n<br>";
    setTimeout(() => {
      this.dfSage2.nativeElement.innerHTML += "Attempting connection to SAGE2...\n<br>";
      // connectToPele
      SAGE2Connection.connectToPele(this.dfSage2.nativeElement);
      // connectToLocalhost
      // SAGE2Connection.connectToLocalhost(this.dfSage2.nativeElement);
    }, 1500);
  }

}
