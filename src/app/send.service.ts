import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { ThreejsBasicComponent } from './threejs-basic.component';
import { AppComponent } from './app.component';
import { D3BarComponent } from './d3-bar.component';

@Injectable()
export class SendService {
    ac1: AppComponent = null;
    tjsbc1: ThreejsBasicComponent = null;
    d3Chart: D3BarComponent = null;
    queueData: Array<Object> = [];
    d3ScriptWasLoaded: Boolean = false;

    // subject (something observable)
    public dataFromTableSource = new Subject<Object>();
    // make an observer of the subject
    dataFromTableObserver$ = this.dataFromTableSource.asObservable();
    // make a way to change the subject
    announceDataFromTable(data: Object) {
        this.dataFromTableSource.next(data);
    }

    setAc(ac: AppComponent): void {
        this.ac1 = ac;
    }
    getAc(): AppComponent {
        return this.ac1;
    }

    setTjs(tjs: ThreejsBasicComponent): void {
        this.tjsbc1 = tjs;
    }
    getTjs(): ThreejsBasicComponent {
        return this.tjsbc1;
    }

    d3ScriptHasBeenLoaded(): void {
        this.d3ScriptWasLoaded = true;
    }

    wasD3ScriptLoaded(): Boolean {
        return this.d3ScriptWasLoaded;
    }



}