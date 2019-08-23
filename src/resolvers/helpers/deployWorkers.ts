import {
  groupsResolver
} from "../workers/groups";

import {
  usersResolver
} from "../workers/users";

import {
  TypesEnum,
  typeResolver
} from "./typeResolver";

import {
  ScalarArg,
  ComplexArg,
  ScalarField,
  ComplexField
} from "./parseFields";

interface Node {
  value: string;
  type: TypesEnum;
  args: Array<ScalarArg | ComplexArg>;
  fields: Array<ScalarField | ComplexField>
}

async function deployWorkers(node : Node, ctx) {
  //console.log(node)
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

  for (let i = 0; i < complexFields.length; i++){
    if (node.type === TypesEnum.GROUP){
      for (let j = 0; j < data["groups"].length; j++){
        data["groups"][j]["members"] = complexFields[i]["data"]  //TODO PRIORITY generalize
        
      }
    }
  }
  return data[Object.keys(data)[0]];
}

export default deployWorkers;