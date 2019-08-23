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
    Object.keys(arg).forEach(key => { //TODO come back to
      if (key == "fields"){
        //console.log("complex", arg.value);
        let complexArg : ComplexArg = {
          type: "complex",
          name: key,
          value: parseArgsSet(arg[key])
        }
        args_out.push(complexArg);
      }
      else {
        //console.log("scalar ", arg[key]);
        let scalarArg : ScalarArg = {
          type: "scalar",
          name: key,
          value: arg[key]
        }
        args_out.push(scalarArg);
      }
    });
    
    

    if (arg.fields) {
    } else {
    }
  })

  return args_out;
}


export {
  ScalarArg,
  ComplexArg,
  parseArgs
};