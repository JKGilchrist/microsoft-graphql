import { extendType, intArg, arg  } from "nexus";

import {
  ScalarArg,
  ComplexArg,
  ScalarField,
  ComplexField,
  parseFields
} from "../helpers/parseFields";

import {
  parseArgs
} from "../helpers/parseArgs";

import deployWorkers from "../helpers/deployWorkers";

import {
  TypesEnum
} from "../helpers/typeResolver";
import orderBy from "../../types/filters/orderbyInputObjectType";
import filter from "../../types/filters/filterInputObjectType";

interface Node {
  value: string;
  type: TypesEnum;
  args: Array<ScalarArg | ComplexArg>;
  fields: Array<ScalarField | ComplexField>
}

const groups = extendType({
  type: "Query",
  definition(t) {
    t.list.field('groups', {
      type: 'Group',
      args: {
        //TODO implement
        filter: arg({type: filter, required: false, description: "" }),
        orderBy: arg({type: orderBy, required: false, description: ""}),
        top: intArg({required: false, description: "The maximum number of results expected"}),
        
      },
      resolve: async (parent, args, ctx, info) => {
        // There is a chance that the root args will have to be specially formatted to match the field args structure, but for now we are ignoring them
        let _args = [];
        if (Object.keys(args).length > 0) {
          _args = [args];
        }

        let root : Node = {
          value: "groups",
          type: TypesEnum.GROUP,
          args: parseArgs(_args),
          fields: parseFields(info)
        }
        //console.log("root", root)
        let data = await deployWorkers(root, ctx); 

        //console.log("data", data)
        return data;
      }
    });
  } 
});

export default groups;