import {
    ScalarField
  } from "./parseFields";

function urlBuilder(url : string, args : any, fields : Array<ScalarField>) : string  {
    
    //TODO keep going on this

    const queryOptions = []; //Stores all eventual query parameters
    console.log (args)
    args.forEach(arg => { //foreach arg, create what it tacks on to the URL
        
        if (arg.name === "filter"){
            arg = arg["value"];
            if (arg.type == "startsWith"){
                queryOptions.push("$filter=" + arg.type +"("+ arg.field + ",'" + arg.value + "')");
            }
            else {
                queryOptions.push("$filter=" + arg.field + " " + arg.type + " '" + arg.value + "'");
            }
        }

        if (arg.name === "orderBy"){
        arg = arg["value"];
        console.log(arg)
        queryOptions.push("$orderby=" + arg[0].value + "%20" + arg[1].value);
        }

        if (arg.name === "top"){
        queryOptions.push("$top=" + arg.value);
        }
    });
    
    let select = "$select=";
    for (let i = 0; i < fields.length; i++){
        select = select + fields[i]["value"] + "," ;
    }
    queryOptions.push(select);
    
    //build url
    for (let i = 0; i < queryOptions.length; i++) {
        if (i === 0) {
        url = url + "?" + queryOptions[i];
        } else {
        url = url + "&" + queryOptions[i];
        }
    }

    
    return url;
}

export default urlBuilder;