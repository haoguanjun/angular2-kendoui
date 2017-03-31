import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'my-app',
    template: `
    <form>
        <fieldset>
            <div>
                <legend>Web Component</legend>
                <div>
                    <kendo-numerictextbox ></kendo-numerictextbox>
                </div>
                <div>
                    <kendo-slider></kendo-slider>
                </div>
                <div>
                    <kendo-grid [data]="gridData" [height]="370">
                        <kendo-grid-column field="ProductID" title="ID" width="40">
                        </kendo-grid-column>
                        <kendo-grid-column field="ProductName" title="Name" width="250">
                        </kendo-grid-column>
                        <kendo-grid-column field="Category.CategoryName" title="Category">
                        </kendo-grid-column>
                        <kendo-grid-column field="UnitPrice" title="Price" width="80">
                        </kendo-grid-column>
                        <kendo-grid-column field="UnitsInStock" title="In stock" width="80">
                        </kendo-grid-column>
                        <kendo-grid-column field="Discontinued" title="Discontinued" width="120">
                            <template kendoGridCellTemplate let-dataItem>
                                <input type="checkbox" [checked]="dataItem.Discontinued" disabled/>
                            </template>
                        </kendo-grid-column>
                    </kendo-grid>
                </div>
            </div>
        </fieldset>
        <button kendoButton >Login</button>
    </form>
    `
})
export class MyAppComponent {
    private gridData = [{
        "ProductID": 1,
        "ProductName": "Chai",
        "SupplierID": 1,
        "CategoryID": 1,
        "QuantityPerUnit": "10 boxes x 20 bags",
        "UnitPrice": 18.0000,
        "UnitsInStock": 39,
        "UnitsOnOrder": 0,
        "ReorderLevel": 10,
        "Discontinued": false,
        "Category": {
            "CategoryID": 1,
            "CategoryName": "Beverages",
            "Description": "Soft drinks, coffees, teas, beers, and ales"
        }
    }]
    constructor() {
    }
}
