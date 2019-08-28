import { objectType, arg, intArg } from "nexus";
import Group from "./group";
import orderBy from "../filters/orderbyInputObjectType";
import filter from "../filters/filterInputObjectType";

const User = objectType({
  name: 'User',
  definition(t : any) {
    t.string("id", { description: "User's Microsoft Graph id.", nullable: false });
    t.string("displayName", { description: "User's display name.", nullable: false });
    t.string("givenName", { description: "User's given name.", nullable: true });
    t.string("surname", { description: "User's surname.", nullable: true });
    t.string("userPrincipalName", { description: "User's principal name.", nullable: true });
    t.string("jobTitle", { description: "User's job title.", nullable: true });
    t.string("mail", { description: "User's email address.", nullable: true });
    t.list.field("groups", {
      type: Group,
      args: {
        filter: arg({type: filter, required: false, description: "" }),
        orderBy: arg({type: orderBy, required: false, description: ""}),
        top: intArg({required: false, description: "The maximum number of results expected"}),
      },
      description: "Groups the user is a member of", 
      nullable: true
    });
    t.string("type", {description: "What type the user is", nullable: false})
  },
});

export default User;