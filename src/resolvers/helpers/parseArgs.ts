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

  let args_out : Array<ScalarArg | ComplexArg> = [];
  if (root.length){
    let set = [];
    root = root[0];
    for (let i = 0; i < Object.keys(root).length ; i++){
      
      let keyy = Object.keys(root)[i]
      let value = root[keyy]
      let ans = {}
      ans[Object.keys(root)[i]] = value
      set.push( ans )
    }

    args_out = parseArgsSet(set);
  }
  return args_out;
}


function parseArgsSet(args : any) : Array<ScalarArg | ComplexArg> {
  let args_out : Array<ScalarArg | ComplexArg> = [];

  //console.log("args ~ ", args)

  args.forEach( arg => { //For each arg
    //console.log( "current arg ~ ", arg)

    Object.keys(arg).forEach(key => { //For each key
      
      if ( parseInt(Object.keys(arg[key])[0]) != 0 && Object.keys(arg[key]).length > 0 ){ // //If there's multiple fields.
        //console.log("complex", arg[key]); 
        let complexArr = {}

        Object.keys(arg[key]).forEach( subKey => {
          complexArr[subKey] = arg[key][subKey];
        })

        complexArr = [complexArr]

        
        let complexArg : ComplexArg = {
          type: "complex",
          name: key + "",
          value: parseArgsSet(complexArr)
        }
        //console.log("HERE", complexArg)
        args_out.push(complexArg);
        //console.log("complexArr" , complexArr)
      }
      else {
        //console.log("scalar ", key, arg[key]);
        let scalarArg : ScalarArg = {
          type: "scalar",
          name: key + "",
          value: arg[key]
        }
        
        args_out.push(scalarArg);
      }
    });
    
    

  })
  
  return args_out;
}


export {
  ScalarArg,
  ComplexArg,
  parseArgs
};