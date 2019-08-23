import { extendType, intArg, arg  } from "nexus";
import filter from "../../types/filters/filterInputObjectType";
import orderBy from "../../types/filters/orderbyInputObjectType";

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
      args: {
        filter: arg({ type: filter, required: false, description: "Specify which field and by what value that field should start with, case insensitive"}),
        orderBy: arg({type: orderBy, required: false, description: ""}),
        top: intArg({required: false, description: "The maximum number of results expected"}),

        /*
        All parameters
        count - doesn't work
        expand - works on some? (can expand users/memberOf (when in beta), can't expand users/userType, can expand users/joinedTeams [when in beta?]. Has limit of 20 results )
        filter - can't be combined with orderby
        format - not really relevant to us
        orderby - can't be combined with filter
        search - Doesn't seem to work
        select - seems to break expand
        skip - used for paging, not relevant right now
        skiptoken - ^
        top parameter - useful
        */

      },
      resolve: async (parent, args, ctx, info) => {
        // There is a chance that the root args will have to be specially formatted to match the field args structure, but for now we are ignoring them
        let _args = [];
        if (Object.keys(args).length > 0) {
          _args = [args];
        }

        let root : Node = {
          value: "users",
          type: TypesEnum.USER,
          args: parseArgs(_args),
          fields: parseFields(info)
        }
        //console.log(root);
        let data = await deployWorkers(root, ctx); 
        return data;
      }
    });
  } 
});

export default users;