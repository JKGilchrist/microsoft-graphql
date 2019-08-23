import { extendType, stringArg  } from "nexus";
import * as request from 'request';

const user = extendType( {
  type: "Query",
  definition(t) {
    t.field('user', {
      type: 'User',
      nullable: true,
      args: {
        id: stringArg({required: true, description: "The id of the expected user"}),
      },
      resolve: async (parent, args, ctx, info) => {

        let url = "https://graph.microsoft.com/v1.0/users/" + args.id + ""

        //General fields
        let user : any = await new Promise( ( resolve, reject ) => {
          request.get({
            url: url,
            headers: {
              "Authorization": "Bearer " + ctx.access_token
            }
          }, function(err, response, body) {
            resolve(JSON.parse(body));
          });
        });


        for (let i = 0; i < info.fieldNodes[0]["selectionSet"]["selections"].length; i++){

          if  ( info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "type" ){ //if they want types
            let urlUserType = url + "/userType"
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
            user.type = type.value;
          }// end of types

          else if (info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "Groups") { //if they want groups
            let urlGroups = url + "/memberOf"

            const groups : any = await new Promise( ( resolve, reject ) => {
                request.get({
                  url: urlGroups,
                  headers: {
                    "Authorization": "Bearer " + ctx.access_token
                  }
                }, function(err, response, body) {
                  resolve(JSON.parse(body));
                });
              });
              user["Groups"] = groups["value"]
          }//end of groups


        }
          




        return user
        
      },
    })
  }
});

export default user;
