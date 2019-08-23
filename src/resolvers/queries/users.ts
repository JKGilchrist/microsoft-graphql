import { extendType  } from "nexus";

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

interface Node {
  value: string;
  type: TypesEnum;
  args: Array<ScalarArg | ComplexArg>;
  fields: Array<ScalarField | ComplexField>
}

const users = extendType({
  type: "Query",
  definition(t) {
    t.list.field('users', {
      type: 'User',
      resolve: async (parent, args, ctx, info) => {
        // There is a chance that the root args will have to be specially formatted to match the field args structure, but for now we are ignoring them
        let _args;
        if (Object.keys(args).length > 0) {
          _args = [];
        } else {
          _args = [];
        }

        console.log(args);

        let root : Node = {
          value: "users",
          type: TypesEnum.USER,
          args: parseArgs(_args),
          fields: parseFields(info)
        }

        let data = await deployWorkers(root, ctx); 

        return data;
      }
    });
  } 
});

export default users;