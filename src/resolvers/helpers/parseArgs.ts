interface ScalarArg {
  type: "scalar";
  name: string;
  value: any;
}

interface ComplexArg {
  type: "complex";
  name: string;
  value: Array<ComplexArg | ScalarArg>;
}

function parseArgs(args : any) {

  let root : any = args;
  
  let args_out : Array<ScalarArg | ComplexArg> = parseArgsSet(root);

  return args_out;
}


function parseArgsSet(args : any) : Array<ScalarArg | ComplexArg> {
  let args_out : Array<ScalarArg | ComplexArg> = [];
  args.map((arg : any) => {

    if (arg.value.fields) {
      //console.log("complex", arg.value);
      let complexArg : ComplexArg = {
        type: "complex",
        name: arg.name.value,
        value: parseArgsSet(arg.value.fields)
      }
      args_out.push(complexArg);
    } else {
      //console.log("scalar ", arg.value);
      let scalarArg : ScalarArg = {
        type: "scalar",
        name: arg.name.value,
        value: arg.value.value
      }
      args_out.push(scalarArg);
    }
  })

  return args_out;
}


export {
  ScalarArg,
  ComplexArg,
  parseArgs
};