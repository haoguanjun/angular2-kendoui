import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DataResult } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './model';
import { EditService, MyEditService } from './edit.service';

@Component({
    selector: 'my-app',
    template: `
      <kendo-grid
          [data]="view | async"
          [height]="400"
          [selectable] = "true"
          [pageSize]="gridState.take" [skip]="gridState.skip" [sort]="gridState.sort"
          [pageable]="true" [sortable]="true"
          (dataStateChange)="onStateChange($event)"
          (selectionChange) = "selectionChangeHandler($event)"
          (edit)="editHandler($event)" (cancel)="cancelHandler($event)"
          (save)="saveHandler($event)" (remove)="removeHandler($event)"
          (add)="addHandler($event)"
        >
        <kendo-grid-toolbar>
            <button kendoGridAddCommand>Add new</button>
        </kendo-grid-toolbar>
        <kendo-grid-column field="ProductName" title="Product Name"></kendo-grid-column>
        <kendo-grid-column field="UnitPrice" editor="numeric" title="Price"></kendo-grid-column>
        <kendo-grid-column field="Discontinued" editor="boolean" title="Discontinued"></kendo-grid-column>
        <kendo-grid-column field="UnitsInStock" editor="numeric" title="Units In Stock"></kendo-grid-column>
        <kendo-grid-command-column title="command" width="220">
            <template let-isNew="isNew">
                <button kendoGridEditCommand class="k-primary">Edit</button>
                <button kendoGridRemoveCommand>Remove</button>
                <button kendoGridSaveCommand [disabled]="formGroup?.invalid">{{ isNew ? 'Add' : 'Update' }}</button>
                <button kendoGridCancelCommand>{{ isNew ? 'Discard changes' : 'Cancel' }}</button>
            </template>
        </kendo-grid-command-column>
      </kendo-grid>
  `
})
export class GridSampleComponent implements OnInit {
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public formGroup: FormGroup;

    private editService: EditService;
    private editedRowIndex: number;

    constructor( @Inject(EditService) editServiceFactory: any, private myService: MyEditService) {
        this.editService = editServiceFactory();
    }

    public ngOnInit(): void {
        // view is a Observable object.
        // this.view = this.editService.map(data => process(data, this.gridState));

        let data = this.myService.data();
        console.log( data );

        let gridDataResult: DataResult = {
            data: data,
            total: data.length
        };

        this.view = Observable.of( gridDataResult );
    }

    public onStateChange(state: State) {
        this.gridState = state;

        this.editService.read();
    }

    public selectionChangeHandler(event){
        console.log( event);
    }

    protected addHandler({ sender }) {
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'ProductID': new FormControl(),
            'ProductName': new FormControl("", Validators.required),
            'UnitPrice': new FormControl(0),
            'UnitsInStock': new FormControl("", Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}')])),
            'Discontinued': new FormControl(false)
        });

        sender.addRow(this.formGroup);
    }

    protected editHandler({ sender, rowIndex, dataItem }) {
        // sender is the grid.
        console.log(sender);
        // current row index
        console.log(rowIndex);
        // data item
        console.log(dataItem);
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'ProductID': new FormControl(dataItem.ProductID),
            'ProductName': new FormControl(dataItem.ProductName, Validators.required),
            'UnitPrice': new FormControl(dataItem.UnitPrice),
            'UnitsInStock': new FormControl(dataItem.UnitsInStock, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}')])),
            'Discontinued': new FormControl(dataItem.Discontinued)
        });

        this.editedRowIndex = rowIndex;

        // switch the row into edit mode.
        sender.editRow(rowIndex, this.formGroup);
    }

    protected cancelHandler({ sender, rowIndex }) {

        // switch the row into normal mode.
        this.closeEditor(sender, rowIndex);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    // http://www.telerik.com/kendo-angular-ui/components/grid/editing/
    protected saveHandler({ sender, rowIndex, formGroup, isNew }) {
        // get data item by from group.
        const product: Product = formGroup.value;

        this.editService.save(product, isNew);

        sender.closeRow(rowIndex);
    }

    protected removeHandler({ dataItem }) {
        this.editService.remove(dataItem);
    }
}