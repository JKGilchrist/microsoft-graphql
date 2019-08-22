import { extendType, stringArg  } from "nexus";
import * as request from 'request';

const group = extendType( {
  type: "Query",
  definition(t) {
    t.field('group', {
      type: 'Group',
      nullable: true,
      args: {
        id: stringArg({required: true, description: "The id of the expected group"}),
      },
      resolve: async (parent, args, ctx, info) => {

        let url = "https://graph.microsoft.com/v1.0/groups/" + args.id;

        
        for (let i = 0; i < info.fieldNodes[0]["selectionSet"]["selections"].length; i++){
            if (info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "members"){
                url = url + "?$expand=members";
                break;
            }
        }
        //General fields
        let group : any = await new Promise( ( resolve, reject ) => {
          request.get({
            url: url,
            headers: {
              "Authorization": "Bearer " + ctx.access_token
            }
          }, function(err, response, body) {
            resolve(JSON.parse(body));
          });
        });
        return group;
        
      },
    })
  }
});

export default group;
