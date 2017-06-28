import { Component, Input, OnInit, AfterContentInit, AfterViewInit, ViewChild } from '@angular/core';

import { SendService } from './send.service';

declare var d3v4: any;

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: []
})


export class DataTableComponent implements OnInit {
  @ViewChild("dataTable") df3js;

  dataForTable: Array<Object>;
  attributesOfEntry = [];

  dataEntryToAdd = {};

  debug = true;

  constructor(private senderOfData: SendService) { }

  ngOnInit(): void {
    this.waitForD3Toload();
  }

  ngAfterViewInit(): void {
  }

  waitForD3Toload(): void {
    if (this.senderOfData.wasD3ScriptLoaded()) {
      this.d3WasLoaded();
    } else {
      setTimeout(() => {
        this.waitForD3Toload();
      }, 1000);
    }
  }

  d3WasLoaded(): void {
		this.dbprint("data-table: Retrieving data from assets/data/CerealData.txt file");
		d3v4.tsv("assets/data/CerealData.txt", function(d) {
      var keys = Object.keys(d);
      for (let i = 0; i < keys.length; i++) {
        if (!isNaN(+d[keys[i]])) {
          d[keys[i]] = +d[keys[i]];
        } 
      }
			return d;
		}, (error, data) => {
			this.dbprint("data-table: data collected finished, the table should be automatically filled by template");
			this.dbdir(data);
      this.dataForTable = data;
      if (data.length > 0) {
        this.attributesOfEntry = Object.keys(data[0]);
        this.giveDataToSendService();
      }
    });
  }

  removeFromData(entry): void {
    this.dbprint("data-table: entry given is in array:" + this.dataForTable.includes(entry));
    this.dataForTable.splice(this.dataForTable.indexOf(entry), 1);
    this.giveDataToSendService();
  }

  addNewEntryToData(): void {
    this.dataForTable.push(this.dataEntryToAdd);
    this.dataEntryToAdd = {};
    this.giveDataToSendService();
  }

  giveDataToSendService(): void {
    this.senderOfData.announceDataFromTable({
      data: this.dataForTable,
      xAxisAttribute: "Mfg",
      yAxisAttribute: "Mfg"
    });
  }



	dbprint(line: string): void {
		if (this.debug) {
			console.log("Debug>" + line);
		}
	}

	dbdir(obj: any): void {
		if (this.debug) {
			console.dir(obj);
		}
	}
}
