import { extendType, stringArg  } from "nexus";
import * as request from 'request';
import { findBreakingChanges } from "graphql";

const users = extendType( {
  type: "Query",
  definition(t) {
    t.list.field('users', {
      type: 'User',
      args: {
        givenNameStartsWith: stringArg({required: false, description: "Filter given names to only include those beginning with a given string"}),
        
      },
      resolve: async (parent, args, ctx, info) => {

        let url = "https://graph.microsoft.com/v1.0/users";
        const queryOptions = [];

        if (args.givenNameStartsWith) {
          queryOptions.push("$filter=startswith(givenName,'" + args.givenNameStartsWith + "')");
        } 

        if (queryOptions.length > 0) {
          for (let i = 0; i < queryOptions.length; i++) {
            if (i === 0) {
              url = url + "?" + queryOptions[i];
            } else {
              url = url + "&" + queryOptions[i];
            }
          }
        }

        const users : any = await new Promise( ( resolve, reject ) => {
          request.get({
            url: url,
            headers: {
              "Authorization": "Bearer " + ctx.access_token
            }
          }, function(err, response, body) {
            resolve(JSON.parse(body));
          });
        });

        
        const result = [];
        users.value.map((user) => {
          result.push({
            id: user.id,
            displayName: user.displayName,
            givenName: user.givenName,
            surname: user.surname,
            userPrincipalName: user.userPrincipalName,
            jobTitle: user.jobTitle,
            mail: user.mail,
          });
        });

        
        //get each user type, if needed. Can get slow depending on how many are needed
        for (let i = 0; i < info.fieldNodes[0]["selectionSet"]["selections"].length; i++){
          if  ( info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "type" ){ //only enters once
            for (let j = 0; j < result.length; j++) {
              let user = result[j];
              let urlUserType = "https://graph.microsoft.com/v1.0/users/" + user.id + "/userType"
              const type : any = await new Promise( ( resolve, reject ) => {
                  request.get({
                    url: urlUserType,
                    headers: {
                      "Authorization": "Bearer " + ctx.access_token
                    }
                  }, function(err, response, body) {
                    resolve(JSON.parse(body));
                  });
                });
                user["type"] = type["value"]
            }
            break;
          }
        }
        
    return result;
  
}})}});

export default users;
