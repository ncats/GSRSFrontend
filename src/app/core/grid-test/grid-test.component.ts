import { Component, OnInit } from "@angular/core";
import { template } from "lodash";

@Component({selector:"grid-test", template:"grid-test.component.html"}) 

export class GridTest implements OnInit {

    somethingSet: string[];

    ngOnInit() {
        console.log("ngOnInit");
        this.somethingSet = [];
        for(var i = 0; i< 20;i++) {
            let value = `Value A ${i+1}`;
            console.log(`adding values ${value}`);
            this.somethingSet.push(value);
        }
    }

}