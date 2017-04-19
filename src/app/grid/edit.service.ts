import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Jsonp } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

                },
                "ProductName": {
                    type: "string",
                    defaultValue: "",
                    editable: false
                },
                "Discountinued": {
                    type: "boolean",
                    defaultValue: false
                },
                "UnitsInStock": {
                    type: "number",
                    defaultValue: 0
                },
                "UnitPrice": {
                    type: "number",
                    defaultValue: 0
                }
            }
        });

        console.log(model.getModel());

        // create data source
        this._ds = new DataSource<Product>(model);

        // add some item
        let item: Product = { "ProductID": 2, "ProductName": "Chang", "UnitPrice": 19, "UnitsInStock": 17, "Discontinued": false };

        this._ds.add({ "ProductID": 1, "ProductName": "Chai", "UnitPrice": 18, "UnitsInStock": 39, "Discontinued": false });
        this._ds.add(item);
        this._ds.add({ "ProductID": 77, "ProductName": "Original Frankfurter grüne Soße", "UnitPrice": 13, "UnitsInStock": 32, "Discontinued": false });

        // remove a item
        this._ds.remove( item );

        console.log( this._ds.hasChanges() );

        // cancel changes.
        this._ds.cancelChanges();
    }

    public data(): Array<any> {
        return this._ds.data();
    }
}

@Injectable()
export class EditService extends BehaviorSubject<any[]> {
    constructor(private jsonp: Jsonp) {
        super([]);
    }

    private data: any[] = [];

    public read() {
        if (this.data.length) {
            return super.next(this.data);
        }

        this.fetch()
            .do(data => this.data = data)
            .subscribe(data => {
                super.next(data);
            });
    }

    public save(data: any, isNew?: boolean) {
        const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

        this.reset();

        this.fetch(action, data)
            .subscribe(() => this.read(), () => this.read());
    }

    public remove(data: any) {
        this.reset();

        this.fetch(REMOVE_ACTION, data)
            .subscribe(() => this.read(), () => this.read());
    }

    public resetItem(dataItem: any) {
        if (!dataItem) { return; }

        //find orignal data item
        const originalDataItem = this.data.find(item => item.ProductID === dataItem.ProductID);

        //revert changes
        Object.assign(originalDataItem, dataItem);

        super.next(this.data);
    }

    private reset() {
        this.data = [];
    }

    private fetch(action: string = "", data?: any): Observable<any[]> {
        return this.jsonp
            .get(`http://demos.telerik.com/kendo-ui/service/Products/${action}?callback=JSONP_CALLBACK${this.serializeModels(data)}`)
            .map(response => response.json());
    }

    private serializeModels(data?: any): string {
        return data ? `&models=${JSON.stringify([data])}` : '';
    }
}
