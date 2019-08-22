import { extendType, stringArg, arg, inputObjectType } from "nexus";
import * as request from 'request';
import filter from "../../types/filters/filterInputObjectType"; 
import orderBy from "../../types/filters/orderbyInputObjectType";

const users = extendType( {
  type: "Query",
  definition(t) {
    t.list.field('users', {
      type: 'User',
      args: {
        filter: arg({ type: filter, required: false, description: "Specify which field and by what value that field should start with, case insensitive"}),
        orderBy: arg({type: orderBy, required: false, description: ""}),
        //can only filter or order, not both
        //count doesnt work

        /*
        All parameters
        count - doesn't work
        expand
        filter - can't be combined with orderby
        format
        orderby - can't be combined with filter
        search
        select
        skip
        skiptoken
        top parameter
        */
      },
      resolve: async (parent, args, ctx, info) => {

        let url = "https://graph.microsoft.com/v1.0/users";
        const queryOptions = [];
        
        if (args.filter){
          if (args.filter.type == "startsWith"){
            queryOptions.push("$filter=" + args.filter.type +"("+ args.filter.field + ",'" + args.filter.value + "')");
          }
          else {          
            queryOptions.push("$filter=" + args.filter.field + " " + args.filter.type + " '" + args.filter.value + "'");
          }
        }
        
        if (args.orderBy){
          queryOptions.push("$orderby=" + args.orderBy.field + "%20" + args.orderBy.orderStyle);
        }
        
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
        console.log(queryOptions)
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
        console.log(users)
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

    console.log(result)
    return result;
  
  },})}});

export default users;
