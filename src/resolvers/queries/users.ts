import { extendType } from "nexus";
import * as request from 'request';

const users = extendType( {
  type: "Query",
  definition(t) {
    t.list.field('users', {
      type: 'User',
      resolve: async (parent, args, ctx, info) => {

        const users : any = await new Promise( ( resolve, reject ) => {
          request.get({
            url:"https://graph.microsoft.com/v1.0/users",
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
            userPrincipleName: user.userPrincipleName,
            jobTitle: user.jobTitle,
            mail: user.mail,
          });
        });

        return result;
      },
    })
  }
});

export default users;
