/*
 * http://docs.telerik.com/kendo-ui/api/javascript/data/model
 * 
 * Fields:
 * 1. id: The value of the Model's ID. This field is available only if the id is defined in the Model configuration. 
 * 2. idField: The name of the Model's ID field. This field is available only if the id is defined in the Model configuration.
 * 3. dirty: Indicates whether the model is modified. I think we don’t need it.
 * 4. fields: A set of key/value pairs the configure the model fields. The key specifies the name of the field. 
 *            Quote the key if it contains spaces or other symbols which are not valid for a JavaScript identifier.
 *            A field configuration cannot contain nested fields' configurations.
 * 
 * 5. options.fields.fieldName.defaultValue
 *    Specifies the default value which will be used for the field when a new model instance is created. 
 *    The default settings depend on the type of the field. The default value for "string" is "", for "number" is 0, and for "date" is new Date() (today).
 *    The parameter can also be set to a function that returns the dynamic default values of the fields. For a live demo, refer to this how-to example.
 * 6. options.fields.fieldName.editable Boolean
 *    Specifies if the field is editable or not. The default value is true.
 * 7. options.fields.fieldName.nullable Boolean
 *    Specifies if the defaultValue setting should be used. The default is false.
 * 8. options.fields.fieldName.parse Function
 *    Specifies the function which will parse the field value. If not set default parsers will be used.
 * 9. options.fields.fieldName.type String
 *    Specifies the type of the field. The available options are "string", "number", "boolean", "date" and "object". The default is "string".
 * 10.options.fields.fieldName.from String
 *    Specifies the field of the original record whose value is used to populate the Model field.
 * 11.options.fields.fieldName.validation Object
 *    Specifies the validation options which will be used by Kendo Validator.
 *
 */

import { Subject, Observable } from 'rxjs';

export interface IField {
    defaultValue: any;
    editable: boolean;      // Specifies if the field is editable or not. The default value is true.
    nullable: boolean;      // Specifies if the defaultValue setting should be used. The default is false.
    // parse();             // Specifies the function which will parse the field value. If not set default parsers will be used.
    type: string;           // Specifies the type of the field. The available options are "string", "number", "boolean", "date" and "object". The default is "string".
    from: string;           // Specifies the field of the original record whose value is used to populate the Model field.
    validation: object;     // Specifies the validation options which will be used by Kendo Validator.
}

export interface IModelOptions {
    id?: string;                                // The name of the field which acts as the identifier of the model. 
    idField?: string;                           // The name of the Model's ID field. This field is available only if the id is defined in the Model configuration.
    defaultId?: any;
    fields: { [fieldName: string]: IField };    // A set of key/value pairs the configure the model fields.
}

export class Model {
    static __uuid = 0;
    static getUUID(){
        return Model.__uuid++;
    }

    static define<T>( metadata: any ){

        let options: IModelOptions = {
            defaultId: null,
            idField: "",
            fields: {}
        };

        options.id = metadata.id;
        options.idField = metadata.idField;
        for(let fieldName in metadata.fields){
            let field = metadata.fields[fieldName];

            if( field.editable ){
                field.editable = true;
            }

            options.fields[fieldName] = field;
        }

        let targetClass = class X {
            static _options: IModelOptions = options;
            private _uid: number = -1;
            private _id: any = null;
            private _data: object = null;
            private _isDirty: boolean = false;
            private _changesCallback: Function = function(){};

            constructor(data: Object){

                this._uid = Model.getUUID();
                // save data
                this._data = data;

                // 
                if( X._options.idField ) {
                    this._id = data[ X._options.idField ];
                }

                for(let memberName in data) {
                    // setter, getter
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set
                    Object.defineProperty( this, memberName, {
                        set: function(value) {
                            let that = this;
                            let field = X._options.fields[memberName];

                            // Is memberName exist?
                            if( !field ){
                                throw `fieldname: ${memberName} don't exist in ${ JSON.stringify( X._options )}.`;
                            }

                            // Is editable?
                            if( !field.editable ) {
                                throw `fieldname: ${memberName} don't editable! in ${ JSON.stringify( field )}.`;
                            }

                            // Is nullable?
                            if( value === null  && !field.nullable ) {
                                throw `fieldname: ${memberName} don't allow null! in ${ JSON.stringify( field )}.`;
                            }
                            
                            if( value !== that._data[memberName]){
                                that._isDirty = true;
                            }

                            that._data[ memberName] = value;

                            // emit changes
                            that._changesCallback({
                                target: that,
                                field: memberName,
                                value: value
                            });
                        },
                        get: function(){
                            let that = this;
                            return that._data[memberName];
                        }
                    } );
                }
            }

            static getModel(){
                return X._options;
            }

            isNew(): boolean {
                let id = this._data[ X._options.idField];
                return id === options.defaultId;
            };

            editable(fieldName: string): boolean {
                let field = (X._options.fields || {})[fieldName];
                return field? field.editable !== false: true;
            }

            changes( callback: Function): boolean {
                if( typeof callback === "function" ) {
                    this._changesCallback = callback;
                    return true;
                }
                return false;
            }
        };

        return targetClass;
    }
}