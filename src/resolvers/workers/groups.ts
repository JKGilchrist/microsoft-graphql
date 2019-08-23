import * as request from "request";
import {
  ScalarField
} from "../helpers/parseFields";
import urlBuilder from "../helpers/urlBuilder";

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

  //build URL
  let url = urlBuilder("https://graph.microsoft.com/v1.0/groups/", args, fields);
  
  //console.log("URL ", url);

  //Call it
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

  //return it
  return groupReq;
}

export {
  groupsResolver
};