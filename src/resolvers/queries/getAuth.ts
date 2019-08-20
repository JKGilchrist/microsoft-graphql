import * as request from 'request';
import { extendType, stringArg } from "nexus";


const things = extendType( {
  type: "Query",
  definition(t) {
    t.field('getAuth', {
      type: 'Auth',
      args: {
        client_id: stringArg({required: true}),
        client_secret: stringArg({required: true})
      },
      resolve: async (parent, args, ctx, info) => {
        const directory_id = "75077ff8-fc81-4d99-a7a6-eb97bbc4b64e";
        const endpoint = "https://login.microsoftonline.com/"+directory_id+"/oauth2/v2.0/token";
        const requestParams = {
          grant_type: "client_credentials",
          client_id: args.client_id,
          client_secret: args.client_secret,
          scope: "https://graph.microsoft.com/.default"
        };

        const authInfo : any = await new Promise( ( resolve, reject ) => {
          request.post({ url:endpoint, form: requestParams }, function (err, response, body) {
            if (err) {
              resolve({
                error: true,
                response: JSON.parse(body)
              });
            }
            else {
              //console.log("Body=" + body);
              let parsedBody = JSON.parse(body);
              if (parsedBody.error_description) {
                resolve(parsedBody);
              }
              else {
                resolve(parsedBody);
                //console.log("Access Token=" + parsedBody.access_token);
              }
            }
        });
        });

        if (authInfo.error) {
          throw new Error(authInfo.error_description);
        }

        return authInfo;
        

      },
    })
  }
});



export default things;
