import { extendType, stringArg  } from "nexus";
import * as request from 'request';

const users = extendType( {
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

        //add userType
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
        user.type = type.value
          

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
          //user.groups.push(
          console.log(groups["value"][i]);
        }


        //Needs to add type to each
          //console.log(user)
        //console.log(user)
        console.log(user)
        return user
        
      },
    })
  }
});

export default users;
