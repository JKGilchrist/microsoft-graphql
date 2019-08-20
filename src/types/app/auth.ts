import { objectType } from "nexus";

const Auth = objectType({
  name: 'Auth',
  definition(t : any) {
    t.string("token_type", { description: "Indicates the token type value. The only type that Azure AD supports is bearer." })
    t.int("expires_in", { description: "How long the access token is valid (in seconds)." });
    t.string("access_token", { description: "The requested access token. Your app can use this token in calls to Microsoft Graph." });
  }
});

export default Auth;