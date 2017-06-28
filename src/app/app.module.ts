import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms'; // NgModel lives here

import { AppComponent } from './app.component';
import { GmapBasicComponent } from './gmap/gmap-basic.component';
import { ThreejsBasicComponent } from './threejs-basic.component';
import { UnityBasicComponent } from './unity-basic.component';
import { D3BarComponent } from './d3-bar.component';
import { DataTableComponent } from './data-table.component';
import { Sage2wsComponent } from './sage2ws.component';

import { SendService } from './send.service';

@NgModule({
  imports: [ // Angular pieces that can be used
    FormsModule, // import the FormsModule before binding with [(ngModel)]
    BrowserModule
  ],
  declarations: [ // usable components
    AppComponent,
    GmapBasicComponent,
    ThreejsBasicComponent,
    UnityBasicComponent,
    D3BarComponent,
    DataTableComponent,
    Sage2wsComponent
  ],
  providers: [ // what components are able to communicate with
    ThreejsBasicComponent,
    SendService],
  bootstrap: [AppComponent] // starter component
})
export class AppModule { }
