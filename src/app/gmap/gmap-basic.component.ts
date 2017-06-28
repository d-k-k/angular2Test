import { Component, OnInit } from '@angular/core';


declare var google: any;

var initCount = 0;

@Component({
  selector: 'gmap-basic',
  templateUrl: './gmap-basic.component.html',
  styleUrls: ['./gmap-basic.component.css']
})
export class GmapBasicComponent implements OnInit {
  loadedMap = false;


  ngOnInit(): void {
		console.log("");
		console.log("GmapBasicComponent  init");
		console.log("");
		// if the global wasn't loaded, attempt to load
		var googleMapScript = document.createElement('script');      //add script attributes
		googleMapScript.async = true;
		googleMapScript.defer = true;
		googleMapScript.onload = (response) => {
			this.showMapAfterGoogleLoad()
		};
		googleMapScript.onerror = (response) => (console.log(response));
		googleMapScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyANE6rJqcfc7jH-bDOwhXQZK_oYq9BWRDY";
		//load script directly on to DOM
		document.body.appendChild(googleMapScript);
  }


  showMapAfterGoogleLoad(): void {
    console.log("Google load status:" + google + ". Map loaded:" + this.loadedMap);
    if (google) {
      if (!this.loadedMap) {
        console.log("Google loaded, generating map...");
        this.loadedMap = true;
        var map = new google.maps.Map(document.getElementById('googleMapContainer'), {
          center: {lat: 21.2990829, lng: -157.8193731},
          zoom: 8
        });
      }
    } else {
      console.log("Google not loaded, waiting...");
      setTimeout(() => {
       this.showMapAfterGoogleLoad(); 
      }, (1000));
    }
  }
}
