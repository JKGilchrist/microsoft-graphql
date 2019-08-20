import * as request from 'request';

async function getToken(directory_id, client_id, client_secret) {
  const endpoint = "https://login.microsoftonline.com/"+directory_id+"/oauth2/v2.0/token";
  const requestParams = {
    grant_type: "client_credentials",
    client_id: client_id,
    client_secret: client_secret,
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
        let parsedBody = JSON.parse(body);
        if (parsedBody.error_description) {
          resolve(parsedBody);
        }
        else {
          resolve(parsedBody);
        }
      }
    });
  });
  let now = new Date();
  let output =  {
    expires_in: now.setHours(now.getHours() + 1),
    access_token: authInfo['access_token']
  };
  return output;
}

export default getToken;