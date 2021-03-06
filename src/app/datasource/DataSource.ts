import { process, DataResult } from '@progress/kendo-data-query';
import { aggregateBy, AggregateDescriptor, AggregateResult } from '@progress/kendo-data-query';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { groupBy, GroupDescriptor } from '@progress/kendo-data-query';
import { filterBy, FilterDescriptor, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Model } from './Model';

let guid = 0;

export class DataSource<T> {

    private _data: Array<T> = [];

    // original data
    private _pristineData: Array<T> = [];
    private _pristineTotal: number = 0;
    private _destroyed: Array<Object> = [];
    private _isDirty: boolean = false;

    private _aggregateOptions: Array<AggregateDescriptor>;
    private _filterOptions: CompositeFilterDescriptor;
    private _groupOptions: Array<GroupDescriptor>;
    private _sortOptions: Array<SortDescriptor>;
    private _pageSize: number = 10;
    private _pageIndex: number = 0;

    constructor(private _model: any) {
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
        this._isDirty = true;
        return obj;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-insert
    insert(index: number, value: T): T {
        this._data.splice(index, 0, value);
        this._isDirty = true;
        return value;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-remove
    remove(value: object): object {
        let result = this.removeModel(this._data, value);
        this._destroyed.push(value);
        this._isDirty = true;
        return value;
    }

    removeModel(items: Array<any>, model) {
        let index: number = items.findIndex(x => x._uid === model._uid);
        if (index !== -1) {
            items.splice(index, 1);
        }
        return model;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-hasChanges
    hasChanges(): boolean {
        if (this._isDirty) {
            return this._isDirty;
        }

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
    cancelChanges(): boolean {
        if (!this._isDirty) {
            return false;
        }

        this._data = [];
        this._destroyed = [];

        this._pristineData.forEach(item => {
            this.add(item);
        })

        return true;
    }

    destroyed() {
        return this._destroyed;
    }

    created() {
        let result: Array<T> = [];
        let data = this.data();
        data.forEach((item: any) => {
            if (item.isNew && item.isNew()) {
                result.push(item);
            }
        });

        return result;
    }

    updated() {
        let result: Array<object> = [];
        let data = this.data();
        data.forEach((item: any) => {
            if (item.isNew && !item.isNew() && item._isDirty) {
                result.push(item);
            }
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
        let that = this;
        if (value) {
            // The slice() method return a shallow copy of a portion of an array into a new array object
            // selected from begin to end (end not included). The original array will not be modified.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
            this._pristineData = value.slice(0);
            this._data = this._observe(value);
        }

        return that._data;
    }

    /*
     * Gets the data item (model) with the specified id.
     * http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-get
     */
    get(id: any): T {
        let that = this;
        let result: T = that._data.find((x: any) => {
            return x._id === id;
        })

        return result;
    }

    _observe(originalData: Array<T>): Array<T> {
        let that = this;
        let _result = [];
        originalData.forEach(item => {
            let obj = new this._model(item);
            obj.changes(x => {
                if (!that._isDirty) {
                    that._isDirty = true;
                }
            })
            _result.push(obj);
        });
        this._isDirty = false;

        return _result;
    }

    // Gets or sets the filter configuration.
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-filter
    filter(options?: CompositeFilterDescriptor): CompositeFilterDescriptor {
        if (options) {
            this._filterOptions = options;
        }

        return this._filterOptions;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-group
    group(options?: Array<GroupDescriptor>): Array<GroupDescriptor> {
        if (options) {
            this._groupOptions = options;
        }

        return this._groupOptions;
    }

    /*
     * Gets or sets the sort order which will be applied over the data items.
     * Array The current sort configuration. 
     * Returns undefined instead of an empty array if the DataSource instance has not performed any sorting so far.
     * http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-sort
     */
    sort(options?: Array<SortDescriptor>): Array<SortDescriptor> {
        if (options) {
            this._sortOptions = options;
        }

        return this._sortOptions;
    }

    /*
     * Gets or sets the aggregate configuration.
     * http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-aggregate
     */
    aggregate(options?: Array<AggregateDescriptor>): Array<AggregateDescriptor> {
        if (options) {
            this._aggregateOptions = options;
        }

        return this._aggregateOptions;
    }

    /*
     * Returns the aggregate results.
     * http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-aggregates
     */
    aggregates(): AggregateResult {
        let that = this;
        let data = that.data();
        let result: AggregateResult = aggregateBy(data, this._aggregateOptions);
        return result;
    }

    /*
     * Gets or sets the current page.
     * http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-page
     */
    page(newPageIndex?: number): number {
        if (newPageIndex) {
            this._pageIndex = newPageIndex;
        }
        return this._pageIndex;
    }



    // Gets or sets the current page size.
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-pageSize
    pageSize(newPageSize?: number): number {
        if (newPageSize) {
            this._pageSize = newPageSize;
        }
        return this._pageSize;
    }

    // Gets the number of available pages.
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-totalPages
    totalPages(): number {
        let that = this;
        let pageSize: number = that.pageSize() || that.total();
        let count: number = Math.ceil( ( that.total() || 0 ) / that._pageSize );
        console.log( count );
        return count;
    }

    /*
     * Returns the data items which correspond to the current page, filter, sort and group configuration. 
     * Compare with the data method, which will return data items from all pages, if local data binding and paging are used.
     * To ensure that data is available this method should be used within the change event handler or the fetch method.
    */
    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-view
    view(): DataResult {
        let that = this;
        let data = that.data();
        let stage1 = process(data, {
            group: that._groupOptions,
            sort: that._sortOptions,
            filter: that._filterOptions
        });

        // currently, we need do paging by self.
        let result = that.paging(stage1)
        return result;
    }

    paging(source: DataResult): DataResult {
        let that = this;
        let pageSize: number = that.pageSize() || that.total();
        if( that.page() < 0 || that.page() > that.totalPages() ) {
            throw `page index out of range!`;
        }

        let result: DataResult = {
            data: [],
            total: 0
        };

        for(let index = that.page() * pageSize; index < Math.min( that.total(), (that.page() + 1) * pageSize ); index++){
            result.data.push( source.data[index]);
            result.total++
        }

        return result;
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/datasource#methods-total
    total(): number {
        return this._data.length;
    }
}