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
    static define<T>( metadata: any ){

        let options: IModelOptions = {
            defaultId: "",
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
            static _options: object = options;

            constructor(data: Object){
                for(let memberName in data) {
                    this[memberName] = data[memberName];
                }
            }

            static getModel(){
                return X._options;
            }

            get(fieldName: string): object|number|string|boolean{
                let value = this[fieldName];
                return value;
            };
            set(fieldName: string, value: object|number|string|boolean){
                this[fieldName] = value;
            };

            isNew(): boolean {
                let id = this[ options.idField];
                return id === options.defaultId;
            };

            editable(fieldName: string): boolean {
                let field = (options.fields || {})[fieldName];
                return field? field.editable !== false: true;
            }

            changes(): Observable<object> {
                return null;
            }
        };

        return targetClass;
    }
}