import * as request from "request";
import {
  ScalarField
} from "../helpers/parseFields";

// Only scalar fields, complex fields are resolved by other resolvers
interface GroupData {
  id?: string;
  createdDateTime?: string;
  description?: string;
  displayName?: string;
  mail?: string;
  mailNickname?: string;
  visibility?: string;
}

async function groupsResolver(args : any, fields : Array<ScalarField>, ctx : any) : Promise<Array<GroupData>>  {

  //console.log("GROUPS ", args, fields);

  let url = "https://graph.microsoft.com/v1.0/groups/";

  // QUERYING LOGIC
  const queryOptions = []; //Stores all eventual query parameters

  args.forEach(arg => { //foreach arg, create what it tacks on to the URL
    if (arg === "filterData"){ //cannot use name filter 
      if (args.filter.type == "startsWith"){
        queryOptions.push("$filter=" + args.filter.type +"("+ args.filter.field + ",'" + args.filter.value + "')");
      }
      else {          
        queryOptions.push("$filter=" + args.filter.field + " " + args.filter.type + " '" + args.filter.value + "'");
      }
    }

    if (arg === "orderby"){
      queryOptions.push("$orderby=" + args.orderBy.field + "%20" + args.orderBy.orderStyle);
    }
  });
  
  //create select parameter
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

  //console.log(url);

  let groupReq : any = await new Promise( ( resolve, reject ) => {
    request.get({
      url: url,
      headers: {
        "Authorization": "Bearer " + ctx.access_token
      }
    }, function(err, response, body) {

      // WE SHOULD PROBABLY CHECK FOR ERRORS HERE

      resolve(JSON.parse(body)["value"]);
    });
  });

  //is this all necessary? Return groupReq
  //currently doesn't work either way
  let groupData : Array<GroupData> = [];
  for (let i = 0 ; i < groupReq.length; i++) {
    groupData.push({
      id: groupReq[i].id,
      createdDateTime: groupReq[i].createdDateTime,
      description: groupReq[i].description, 
      displayName: groupReq[i].displayName, 
      mail: groupReq[i].mail, 
      mailNickname: groupReq[i].mailNickname, 
      visibility: groupReq[i].visibility, 
    });
  }


  return groupData;
}

export {
  groupsResolver
};