import { extendType, stringArg, intArg  } from "nexus";

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

import {
  groupsResolver
} from "../workers/groups";

import {
  usersResolver
} from "../workers/users";

import {
  TypesEnum,
  typeResolver
} from "../helpers/typeResolver";

interface Node {
  value: string;
  type: TypesEnum;
  args: Array<ScalarArg | ComplexArg>;
  fields: Array<ScalarField | ComplexField>
}

async function deployWorkers(node : Node, ctx) {
  let data = {};
  let scalarFields : Array<ScalarField> = [];
  let complexFields = [];

  let fields : any = node.fields;
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].type == "complex") {
      let fieldNode : Node = {
        value: fields[i].value,
        type: typeResolver(node.type, fields[i]),
        args: fields[i].args,
        fields: fields[i].fields
      }
      complexFields.push({
        value: fields[i].value,
        data: await deployWorkers(fieldNode, ctx)
      })

    } else {
      scalarFields.push(fields[i]);
    }
  }
  
  let scalarData;
  if (node.type === TypesEnum.GROUP) {
    scalarData = await groupsResolver(node.args, scalarFields, ctx);
  }
  else if (node.type === TypesEnum.USER) {
    scalarData = await usersResolver(node.args, scalarFields, ctx);
  }
  
  data[node.value] = scalarData;

  complexFields.map((complexField) => {
    data[node.value][complexField.value] = complexField.data[complexField.value];
  });

  return data["groups"]; //TODO - this will always be called groups, yeah?
} 


const groups = extendType({
  type: "Query",
  definition(t) {
    t.list.field('groups', {
      type: 'Group',
      args: {
        top: intArg({required: false, description: "The maximum number of results expected"}),

      },
      resolve: async (parent, args, ctx, info) => {
        // There is a chance that the root args will have to be specially formatted to match the field args structure, but for now we are ignoring them
        let _args = [];
        if (Object.keys(args).length > 0) {
          _args = [args];
        }

        console.log(_args)
        let root : Node = {
          value: "groups",
          type: TypesEnum.GROUP,
          args: parseArgs(_args),
          fields: parseFields(info)
        }
        console.log("root", root)
        let data = await deployWorkers(root, ctx); 

        return data;
      }
    });
  } 
});

export default groups;
