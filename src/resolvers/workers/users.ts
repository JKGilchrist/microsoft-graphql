import * as request from "request";
import {
  ScalarField
} from "../helpers/parseFields";

import urlBuilder from "../helpers/urlBuilder";

// Only scalar fields, complex fields are resolved by other resolvers
interface UserData {
  id?: string;
  displayName?: string;
  givenName?: string;
  surname?: string;
  userPrincipleName?: string;
  jobTitle?: string;
  mail?: string;
  type?: string;
}

async function usersResolver(args : any, fields : Array<ScalarField>, ctx : any) : Promise<Array<UserData>>  {
  
  //console.log("USERS", args, fields);
  
  //Build url
  let url = urlBuilder("https://graph.microsoft.com/v1.0/users/", args, fields);
  
  //console.log("URL ", url);

  //call it
  let userReq : any = await new Promise( ( resolve, reject ) => {
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
  return userReq;

}

export {
  usersResolver
};