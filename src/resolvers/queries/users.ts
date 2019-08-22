import { extendType, stringArg, arg, inputObjectType } from "nexus";
import * as request from 'request';
//import filterer from "./filterInputObjectType"; //TODO broken
import orderby from "./orderbyInputObjectType";

const users = extendType( {
  type: "Query",
  definition(t) {
    t.list.field('users', {
      type: 'User',
      args: {
        //filter: arg({ type: filterer, required: false, description: "Specify which field and by what value that field should start with, case insensitive"}),
        orderBy: arg({type: orderby, required: false, description: ""}),
        
      },
      resolve: async (parent, args, ctx, info) => {

        let url = "https://graph.microsoft.com/v1.0/users";
        const queryOptions = [];
        
        //if (args.filter){
        //  queryOptions.push("$filter=startswith("+ args.filter.field + ",'" + args.filter.startsWith + "')");
        //}
        
        let getType = false; //used later to determine if needed to get type for each user
        let getGroup = false; //used later to determine if needed to get group for each user

        let select = "$select=" ;

        for (let i = 0; i < info.fieldNodes[0]["selectionSet"]["selections"].length; i++){
          select = select + info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] + "," ;

          if (info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "type" ) getType = true;
          else if (info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "Group" ) getGroup = true;
        }
        queryOptions.push(select);

        //build url
        for (let i = 0; i < queryOptions.length; i++) {
          if (i === 0) {
            url = url + "?" + queryOptions[i];
          } else {
            url = url + "&" + queryOptions[i];
          }
        }
        console.log(url)

        //General call
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

        //if individual calls are needed
        if  ( getType || getGroup ){
            for (let j = 0; j < result.length; j++) {
              let user = result[j];

              if (getType){ //If asked for type of each user
              let urlUserType = "https://graph.microsoft.com/v1.0/users/" + user.id + "/userType";
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
              
              user["type"] = type["value"];
            }

              if (getGroup){
                let urlGroups = "https://graph.microsoft.com/v1.0/users/" + user.id + "/memberOf" ;
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
                
                  user["Groups"] = groups["value"];
              }
            }
          }//end of type

    return result;
  
  },})}});

export default users;
