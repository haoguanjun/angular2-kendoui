import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Model } from './Model';
import { DataItem } from './dataitem';


let guid = 0;

export class DataSource<T> extends Subject<DataItem> {

    // observable data
    private _data: Array<T> = [];
    private _data$ = new BehaviorSubject<Array<T>>(null);

    // original data
    private _pristineData: Array<T> = [];
    private _pristineTotal: number = 0;

    private _changes: Subject<object> = new Subject<object>();

    private _destroyed: Array<Object> = [];

    constructor(private _model: any) {
        super();
    }

    // Reads data items from a remote/custom transport (if the transport option is set) or from a JavaScript array (if the data option is set).
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-read
    read() {
        // do nothing in sync mode.
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-add
    add(value: T): T {
        let obj = new this._model(value);
        this._data.push(obj);
        this._pristineData.push(value);
        this._changes.next(null);
        return obj;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-insert
    insert(index: number, value: DataItem): DataItem {
        this._changes.next(null);
        return value;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-remove
    remove(value: object): object {
        let result = this.removeModel(this._data, value);
        this._destroyed.push(value);
        return value;
    }

    removeModel(items: Array<any>, model) {
        let index: number = items.findIndex(x => x.uid === model.uid);
        if (index !== -1) {
            items.splice(index, 1);
        }
        return model;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-hasChanges
    hasChanges(): boolean {
        if (this._destroyed.length) {
            return true;
        }

        let data = this.data();
        data.forEach((item: any) => {
            if ((item.isNew && item.isNew()) || item.dirty) {
                return true;
            }
        })
        return false;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-cancelChanges
    cancelChanges(): Observable<Array<DataItem>> {
        this._data = [];
        this._destroyed = [];

        this._pristineData.forEach(item => {
            this.add(item);
        })

        return Observable.of([]);
    }

    destroyed() {
        return this._destroyed;
    }

    created() {
        let result: Array<DataItem> = [];
        let data = this.data();
        data.forEach(item => {
            // if(item.isNew && item.isNew()) {
            //     result.push( item);
            //}
        });

        return result;
    }

    updated() {
        let result: Array<object> = [];
        let data = this.data();
        data.forEach(item => {
            // if( item.isNew && !item.isNew() && item.dirty) {
            //     result.push(item);
            // }
        });

        return result;
    }

    /*
     * Gets or sets the data items of the data source.
     *
     * If the data source is bound to a JavaScript array (via the data option), 
     * the data method will return the items of that array. 
     * Every item from the array is wrapped in a kendo.data.ObservableObject or kendo.data.Model 
     * (if the schema.model option is set).
     * 
     * Returns
     * the data items of the data source
     * Returns empty array if the data source hasn't been populated with data items
     */
    data(value?: Array<T>): Array<T> {
        if (value) {
            // The slice() method return a shallow copy of a portion of an array into a new array object
            // selected from begin to end (end not included). The original array will not be modified.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
            this._pristineData = value.slice(0);
            this._data = this._observe(value);
            this._data$.next(this._data);
        }

        return this._data;
    }

    _observe(originalData: Array<T>): Array<T> {

        let _result = [];
        originalData.forEach(item => {
            // if( item instanceof Observable)
            _result.push(item);
        });

        return _result;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-group
    group(value?: object): Array<object> {
        return [];
    }

    /*
     * Gets or sets the filter configuration.
     * http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-filter
     */
    // filter(value?: object): object {
    //     return null;
    // }

    /*
     * Gets or sets the sort order which will be applied over the data items.
     * Array The current sort configuration. 
     * Returns undefined instead of an empty array if the DataSource instance has not performed any sorting so far.
     * http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-sort
     */
    sort(value: object): Array<object> {
        return [];
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-pageSize
    pageSize(size?: number): number {
        return 0;
    }

    // Gets the number of available pages.
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-totalPages
    totalPages(): number {
        return 0;
    }

    /*
     * Returns the data items which correspond to the current page, filter, sort and group configuration. 
     * Compare with the data method, which will return data items from all pages, if local data binding and paging are used.
     * To ensure that data is available this method should be used within the change event handler or the fetch method.
    */
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-view
    view(): Observable<Array<DataItem>> {
        return Observable.of([]);
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-total
    total(): number {
        return 0;
    }

    _changeHandler() {

    }


}