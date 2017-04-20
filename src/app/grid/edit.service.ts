import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Jsonp } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataResult } from '@progress/kendo-data-query';

import { Model, IField, IModelOptions } from '../datasource/Model';
import { DataSource } from '../datasource/datasource';
import { Product } from './model';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable()
export class MyEditService extends BehaviorSubject<any[]> {

    private _ds: DataSource<Product>;

    constructor() {
        super(null);

        var model = Model.define<Product>({
            idField: "ProductID",
            fields: {
                "ProductID": {
                    editable: true
                },
                "ProductName": {
                    type: "string",
                    defaultValue: "",
                    editable: true
                },
                "Discontinued": {
                    type: "boolean",
                    defaultValue: false,
                    editable: true
                },
                "UnitsInStock": {
                    type: "number",
                    defaultValue: 0,
                    editable: true
                },
                "UnitPrice": {
                    type: "number",
                    defaultValue: 0,
                    editable: true
                }
            }
        });

        console.log(model.getModel());

        // create data source
        this._ds = new DataSource<Product>(model);

        // add some item
        let items: Array<Product> = [
            { "ProductID": 1, "ProductName": "Chai", "UnitPrice": 18, "UnitsInStock": 39, "Discontinued": false },
            { "ProductID": 2, "ProductName": "Chang", "UnitPrice": 19, "UnitsInStock": 17, "Discontinued": false },
            { "ProductID": 77, "ProductName": "Original Frankfurter grüne Soße", "UnitPrice": 13, "UnitsInStock": 32, "Discontinued": false }
        ]

        this._ds.data(items);
    }

    public data(): DataResult {
        return this._ds.view();
    }

    public save(data: Product, isNew?: boolean) {
        const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

        if (isNew) {
            this._ds.add(data);
        }
        else {
            let target = this._ds.get(data.ProductID);
            console.log( target );
            Object.assign(target, data);
        }

        console.log( this._ds );
    }

    public remove(data: any): boolean {
        let target = this._ds.get(data.ProductID);
        if( !target ) {
            return false;
        }

        this._ds.remove( target );
    }
}
