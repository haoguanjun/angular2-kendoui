import { Subject, Observable } from 'rxjs';

export class DataItem extends Subject<object> {

    private _data: Object;
    private _isNew: boolean;
    private _dirty: boolean;
    
    constructor(value: Object) {
        super();
        this._data = Object.assign({}, value);
    }

    // http://docs.telerik.com/kendo-ui/api/javascript/data/observableobject#methods-set
    set(field: string, value: Number | Date | String | Object): boolean {
        let current = this._data[field];
        if (current !== value) {
            this._data[field] = value;
            this.next({
                type: "set",
                field: field,
                value: value
            });
            return true;
        }
        else {
            return false;
        }
    }

    /* 
     * Gets the value of the specified field.
     * http://docs.telerik.com/kendo-ui/api/javascript/data/observableobject#methods-get
     */
    get(field: string): Object {
        let result: Object = null;
        if (field === "this") {
            result = this._data;
        }
        else {
            result = this._data[field];
        }
        return result;
    }
}