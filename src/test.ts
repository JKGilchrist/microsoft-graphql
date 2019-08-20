import * as request from 'request';
require("dotenv").config();

request.get({
  url:"https://graph.microsoft.com/v1.0/groups",
  headers: {
    "Authorization": "Bearer " + process.env.ACCESS_TOKEN
  }
}, function(err, response, body) {
  console.log(JSON.parse(body));
});