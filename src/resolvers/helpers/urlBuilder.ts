import {
    ScalarField
  } from "./parseFields";
import { url } from "inspector";

function urlBuilder(url : string, args : any, fields : Array<ScalarField>) : string  {

    
    const queryOptions = []; //Stores all eventual query parameters
    
    args.forEach(arg => { //foreach arg, create what it tacks on to the URL
        
        if (arg.name === "filter"){ //cannot use name filter 
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
        queryOptions.push("$orderby=" + arg.field + "%20" + arg.orderStyle);
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