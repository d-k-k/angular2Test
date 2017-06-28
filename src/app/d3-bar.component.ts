import { Component, OnInit, ViewChild } from '@angular/core';

import { SendService } from './send.service';

import './../assets/js/d3v4.js';

declare var d3v4: any;

@Component({
	selector: 'd3-bar',
	templateUrl: './d3-bar.component.html',
	styleUrls: ['./d3-bar.component.css']
})

export class D3BarComponent implements OnInit {
	@ViewChild("d3BarContainer") chartDiv;

	chartValues: any;
	svg: any;
	debug = true;


	constructor(private dataSender: SendService) {
		dataSender.dataFromTableObserver$.subscribe(
			chartValues => {
				this.dbprint("d3-bar: data from table subscription update");
				this.chartValues = chartValues;
				this.generateBar(chartValues);
			});
	}

	ngOnInit(): void {
		console.log("");
		console.log("d3 bar init");
		console.log("");
		// if the global wasn't loaded, attempt to load
		console.log("attempting to load d3 script");
		var d3v4ScriptTag = document.createElement('script');      //add script attributes
		d3v4ScriptTag.async = true;
		d3v4ScriptTag.defer = true;
		d3v4ScriptTag.onload = (response) => {
			this.dataSender.d3ScriptHasBeenLoaded();
			this.d3WasLoaded(response)
		};
		d3v4ScriptTag.onerror = (response) => (this.d3LoadErrored(response));
		d3v4ScriptTag.src = "assets/js/d3v4.js";
		//load script directly on to DOM
		document.body.appendChild(d3v4ScriptTag);
	}

	/**
	* Activated if the script loads
	*
	* @method d3WasLoaded
	* @param {Object} response - additional information of the load.
	*/
	d3WasLoaded(response): void {
		this.dbprint("d3-bar: Retrieving data from assets/data.tsv file");
		d3v4.tsv("assets/data/data.tsv", function(d) {
			d.frequency = +d.frequency; // specific to file
			return d;
		}, (error, data) => {
			this.dbprint("d3-bar: data collected starting chart generation");
			this.chartValues = {
				data: data,
				xAxisAttribute: "letter",
				yAxisAttribute: "letter"
			};
			this.generateBar(this.chartValues);
		});
	}

	/**
	* Activated if the script load errors
	*
	* @method d3Errored
	* @param {Object} error - additional information of the error.
	*/
	d3LoadErrored(error): void {
		console.log("d3 load errored:" + error);
	}

	/**
	* Generate a bar graph
	*
	* @method generateBar
	* @param {Object} chartValues - assumed to contain all necessary data to build
	*/
	generateBar(chartValues): void {
		this.chartPrep(chartValues);
		this.setDomainsBarOrPie(chartValues);
		chartValues.yAxisSuffix = ""; // used for ticks, but has to be data accurate...

		chartValues.g.append("g")
				.attr("class", "axis axis--x")
				.attr("transform", "translate(0," + chartValues.height + ")")
				.call(d3v4.axisBottom(chartValues.xAxis))
				.append("text")
				.attr("x", chartValues.width / 2)
				.attr("y", chartValues.margin.bottom / 2)
				.attr("dy", "0.71em")
				.attr("fill", "black")
				.text(chartValues.xAxisAttribute);

		chartValues.g.append("g")
				.attr("class", "axis axis--y")
				.call(d3v4.axisLeft(chartValues.yAxis).ticks(10, chartValues.yAxisSuffix))
				.append("text")
				.attr("y", chartValues.margin.left / -2)
				.attr("dy", "0.71em")
				.attr("text-anchor", "end")
				.attr("fill", "black")
				.text("Count");

		chartValues.g.selectAll(".bar")
				.data(chartValues.groupedByXAxis) // not actually the original data set, since needed the groupings
				.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return chartValues.xAxis(d.key); }) // use the key of the grouping
				.attr("y", function(d) { return chartValues.yAxis(d.values.length); }) // the count for the key
				.attr("width", chartValues.xAxis.bandwidth()) // auto calc by the scaleBand
				.attr("height", function(d) { return chartValues.height - chartValues.yAxis(d.values.length); }) // one bar, not pieces. Or...?
				.attr("fill", "steelblue")
				.on('mouseover', this.overEffect)
				.on('mouseout', this.outEffect)
				.on('mousedown', this.downEffect);

		this.dbprint("end of generate");
	}

	chartPrep(chartValues): void {
		// clear chartDiv, set margins, width, height.
		// then make svg and a group to put stuff in
		this.chartDiv.nativeElement.innerHTML = "";
		this.dbprint("Size of d3 component native element:" + this.chartDiv.nativeElement.clientWidth + "," + this.chartDiv.nativeElement.clientHeight);
		chartValues.margin = { // space for the chart, note: char axis may go in this area.
			top: this.chartDiv.nativeElement.clientHeight * 0.08,
			right: this.chartDiv.nativeElement.clientWidth * 0.08,
			bottom: this.chartDiv.nativeElement.clientHeight * 0.08,
			left: this.chartDiv.nativeElement.clientWidth * 0.08
		};
		chartValues.width = this.chartDiv.nativeElement.clientWidth - chartValues.margin.left - chartValues.margin.right;
		chartValues.height = this.chartDiv.nativeElement.clientHeight - chartValues.margin.top - chartValues.margin.bottom;
		this.svg = d3v4.select(this.chartDiv.nativeElement).append("svg");

		// always occupy full app size
		this.svg.attr("width", "100%").attr("height", "100%");
		this.svg.attr("preserveAspectRatio", "none");
		this.svg.attr("viewBox", " 0 0 " + this.chartDiv.nativeElement.clientWidth + " " + this.chartDiv.nativeElement.clientHeight);
		chartValues.g = this.svg.append("g").attr("transform", "translate(" + chartValues.margin.left + "," + chartValues.margin.top + ")");

		// time convert always, convert time before checking if an element is a string
		this.timeConvertData(chartValues);

		// axis settings, if not set use linear by default
		if (typeof chartValues.data[0][chartValues.xAxisAttribute] === "string") {
			this.dbprint("Changing xAxis to scaleBand, detected a string attribute");
			chartValues.xAxisScale = "scaleBand";
		} else if (!chartValues.xAxisScale) {
			this.dbprint("No xAxis scale detected, making scaleLinear");
			chartValues.xAxisScale = "scaleLinear";
		}
		chartValues.xAxis = d3v4[chartValues.xAxisScale]().rangeRound([0, chartValues.width]);

		// same for y axis, default is linear
		if (typeof chartValues.data[0][chartValues.yAxisAttribute] === "string") {
			this.dbprint("Changing yAxis to scaleBand, detected a string attribute");
			chartValues.yAxisScale = "scaleBand";
		} else if (!chartValues.yAxisScale) {
			this.dbprint("No yAxis scale detected, making scaleLinear");
			chartValues.yAxisScale = "scaleLinear";
		}
		chartValues.yAxis = d3v4[chartValues.yAxisScale]().rangeRound([chartValues.height, 0]);

	}

	/**
	* Sets the domain for Bar or Pie.
	* Current assumption is that bar / pie will always be counts of the attributes.
	*
	* @method setDomainsBarOrPie
	* @param {Object} chartValues - assumed to contain all necessary data to build
	*/
	setDomainsBarOrPie(chartValues): void {
		// redo the x axis always. redo y axis since it's scale is determined by x axis
		chartValues.xAxis = d3v4.scaleBand().rangeRound([0, chartValues.width]).padding(0.1);
		chartValues.yAxis = d3v4.scaleLinear().rangeRound([chartValues.height, 0]);
		// domain is the different xAxis values map is 1:1 but ok, because each x axis attribute occupies a spot
		if (typeof chartValues.data[0][chartValues.xAxisAttribute] === "number") {
			chartValues.xAxis.domain(
				chartValues.data.map(function(d) {return d[chartValues.xAxisAttribute];}).sort(function(a, b) {
					if (a < b) {
						return -1;
					} else if (b < a) {
						return 1;
					}
					return 0;
				})
			);
		} else {
			chartValues.xAxis.domain(chartValues.data.map(function(d) {return d[chartValues.xAxisAttribute];}).sort());
		}
		this.setGroupedByXAxis(chartValues);
	}

	timeConvertData(chartValues): void {
		var xConvert = (chartValues.xAxisScale == "scaleTime") ? true : false;
		xConvert = (xConvert && typeof chartValues.data[0][chartValues.xAxisAttribute] === "string") ? true : false;
		var yConvert = (chartValues.yAxisScale == "scaleTime") ? true : false;
		yConvert = (yConvert && typeof chartValues.data[0][chartValues.yAxisAttribute] === "string") ? true : false;

		if (xConvert || yConvert) {
			// parse out the time from a string
			// this needs to be expanded out
			// this may be different per file format

			var parseTime;
			parseTime = this.detectParsePattern(chartValues);
			this.dbprint("Detected time pattern:" + parseTime);
			// parseTime = d3v4.timeParse("%d-%b-%y"); // %d day w/ 0 prefix, %b abreviated month name, %y year without century
			// using two different time matchers
			parseTime = d3v4.timeParse(parseTime);

			chartValues.data = chartValues.data.map(function(d) {
				if (xConvert) {
					d[chartValues.xAxisAttribute] = parseTime(d[chartValues.xAxisAttribute]);
				}
				if (yConvert) {
					d[chartValues.yAxisAttribute] = parseTime(d[chartValues.yAxisAttribute]);
				}
				// d[chartValues.yAxisAttribute] = +d[chartValues.yAxisAttribute];
				return d;
			});
		}
	}

	detectParsePattern(chartValues): string {
		var elem1 = chartValues.data[0];
		var xConvert = (chartValues.xAxisScale == "scaleTime") ? true : false;
		var yConvert = (chartValues.yAxisScale == "scaleTime") ? true : false;
		var pattern = "";
		var timeEntry;
		if (xConvert) {
			timeEntry = elem1[chartValues.xAxisAttribute];
		} else if (yConvert) {
			timeEntry = elem1[chartValues.yAxisAttribute];
		} else {
			console.log("error no time attribute, but was given scaleTime?");
		}

		// only if there was a time entry
		if (timeEntry) {
			if (timeEntry.indexOf("!") !== -1) {
				pattern = "%Y!%m!%d";
			} else if (timeEntry.indexOf("-") !== -1) {
				pattern = "%d-%b-%y";
			}
		}

		return pattern;
	}

	/**
	* Sets the setGroupedByXAxis property for bar or pie.
	* Current assumption is that bar / pie will always be counts of the attributes.
	*
	* @method setGroupedByXAxis
	* @param {Object} chartValues - assumed to contain all necessary data to build
	*/
	setGroupedByXAxis(chartValues): void {
		// need to nest(group by) in order to get a count
		// groupedByXAxis is an array [{key: "1931", values: [...], {key: "1932", values: [ ...
		chartValues.groupedByXAxis = d3v4.nest() // apply a nest (group by)
			.key(function(d) { return d[chartValues.xAxisAttribute]; }) // first group by the attribute
			.entries(chartValues.data); // do nest on the data
		// set domain
		chartValues.yAxis.domain([0, d3v4.max(chartValues.groupedByXAxis, function(d) { return d.values.length; })]);
	}

	overEffect(d): void {
		var d3Selection = d3v4.select(this);
		var de = d3Selection.attr("downEffect"); // returns a string, or null if doesn't exist.
		if (!de || de === "false") {
			if (!d3Selection.attr("startingColor")) {
				d3Selection.attr("startingColor", d3Selection.attr("fill"));
				d3Selection.attr("startingStrokeWidth", d3Selection.attr("stroke-width"));
				d3Selection.attr("startingStroke", d3Selection.attr("stroke"));
			}
			d3Selection.attr("fill", "red");
			d3Selection.attr("stroke", "red");
			d3Selection.attr("stroke-width", "4px");
		}
	}

	outEffect(): void {
		var d3Selection = d3v4.select(this);
		var de = d3Selection.attr("downEffect"); // returns a string, or null if doesn't exist.
		if (!de || de === "false") {
			d3Selection.attr("fill", d3Selection.attr("startingColor"));
			d3Selection.attr("stroke", d3Selection.attr("startingStroke"));
			d3Selection.attr("stroke-width", d3Selection.attr("startingStrokeWidth"));
		}
	}

	downEffect(): void {
		var s = d3v4.select(this);
		var de = s.attr("downEffect"); // returns a string, or null if doesn't exist.
		if (!de || de === "false") {
			s.attr("downEffect", true);
			s.attr("fill", "green");
			s.attr("stroke", "black");
			s.attr("stroke-width", "4px");
		} else {
			s.attr("downEffect", false);
			s.attr("fill", s.attr("startingColor"));
			s.attr("stroke", s.attr("startingStroke"));
			s.attr("stroke-width", s.attr("startingStrokeWidth"));
		}
	}

	dbprint(line: string): void {
		if (this.debug) {
			console.log("Debug>" + line);
		}
	}

}


