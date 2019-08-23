import { extendType, stringArg, arg, inputObjectType, intArg } from "nexus";
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
        top: intArg({required: false, description: "The maximum number of results expected"}),
        //can only filter or order, not both

        /*
        All parameters
        count - doesn't work
        expand - works on some? (can expand users/memberOf (when in beta), can't expand users/userType, can expand users/joinedTeams [when in beta?]. Has limit of 20 results )
        filter - can't be combined with orderby
        format - not really relevant to us
        orderby - can't be combined with filter
        search - Doesn't seem to work
        select - seems to break expand
        skip - used for paging, not relevant right now
        skiptoken - ^
        top parameter - useful
        */
      },
      resolve: async (parent, args, ctx, info) => {
        let url = "https://graph.microsoft.com/beta/users";
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
        if (args.top){
          queryOptions.push("$top=" + args.top);
        }
        
        let getType = false; //used later to determine if needed to get type for each user

        //let select = "$select=" ;
        //console.log("info", info.fieldNodes[0]["selectionSet"]["selections"])
        for (let i = 0; i < info.fieldNodes[0]["selectionSet"]["selections"].length; i++){
          //if (info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] != "groups"){
          //select = select + info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] + "," ;
        //}
          if (info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "type" ) {
            getType = true
          }
          else if (info.fieldNodes[0]["selectionSet"]["selections"][i]["name"]["value"] == "groups" ) { //new get group, although doesn't play well with select
            queryOptions.push("$expand=memberOf")
          }
        }
        //queryOptions.push(select);

        //build url
        //console.log(queryOptions)
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
        console.log(users);

        users["value"].forEach(user => {
          console.log("H")
          console.log(user.memberOf)
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
            groups: user.memberOf
          });
        });

        //if individual calls are needed
        if  ( getType ){
            for (let j = 0; j < result.length; j++) {
              let user = result[j];

              if (getType){ //If asked for type of each user, only enters this statment once
              //should swap to batch
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

            }
          }//end of type

    //console.log(result)
    return result;
  
  },})}});

export default users;
