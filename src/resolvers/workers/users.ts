import * as request from "request";
import {
  ScalarField
} from "../helpers/parseFields";

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

  console.log("USERS ", args, fields)
  
  let url = "https://graph.microsoft.com/v1.0/groups/";

  // YOUR QUERYING LOGIC HERE

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

  let userData : Array<UserData> = [];

  for (let i = 0 ; i < userReq.length; i++) {
    userData.push({
      id: userReq[i].id,
      // etc...
    });
  }

  return userData;
}

export {
  usersResolver
};