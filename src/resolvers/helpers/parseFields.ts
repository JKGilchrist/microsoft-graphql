
import {
  ScalarArg,
  ComplexArg,
  parseArgs
} from "./parseArgs";

// Interface for the Field object found within the info object
interface Field {
  kind: "Field";
  alias?: string;
  name: {
    kind: "Name";
    value: string;
    loc: object;
  }
  arguments: any; // for now
  directives: any; // for now
  selectionSet?: SelectionSet;
}

// Interface for the SelectionSet object found within the info object
interface SelectionSet {
  kind: "SelectionSet";
  selections: Array<Field>;
  loc: object;
}

// Interface for outputting scalar fields
interface ScalarField {
  type: 'scalar';
  value: string;
}

// Interface for outputting nested fields
interface ComplexField {
  type: 'complex';
  value: string;
  args: Array<any>;
  fields: Array<ScalarField | ComplexField>;
}

function parseFields(info : any) {

  let root = info.fieldNodes[0]["selectionSet"];
  
  let selectedFields : Array<ScalarField | ComplexField> = parseSelectionSet(root);

  return selectedFields;
}

/**
 * Recursive function which parses selection sets
 * @param selectionSet 
 */
function parseSelectionSet(selectionSet : SelectionSet) : Array<ScalarField | ComplexField> {
  let fields : Array<ScalarField | ComplexField> = [];

  selectionSet.selections.map((field : Field) => {
    if (field.selectionSet) {
      let complexField : ComplexField = {
        type: 'complex',
        value: field.name.value,
        fields: parseSelectionSet(field.selectionSet),
        args: []
      };

      if (field.arguments) {

        let args : Array<ScalarArg | ComplexArg> = parseArgs(field.arguments);

        complexField.args = args;
      }
      fields.push(complexField);

    } else {

      let scalarField : ScalarField = {
        type: 'scalar',
        value: field.name.value,
      };
      fields.push(scalarField);

    }
  })
  
  return fields;
}

export {
  ScalarArg,
  ComplexArg,
  ScalarField,
  ComplexField,
  parseFields
};