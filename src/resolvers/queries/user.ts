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

        //get user type, if needed
        for (let i = 0; i < info.fieldNodes[0]["selectionSet"]["selections"].length; i++){
          if  ( info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "type" ){
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
            break;
          }
        }
          
        //groups
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
        user.groups = [{"id": "iddd"}]
        for (let i = 0; i <  groups["value"].length; i++ ){
          user.groups[i] = {
            id: groups["value"][i]["id"]
          }
          
        }


        return user
        
      },
    })
  }
});

export default user;
