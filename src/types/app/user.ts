import { objectType } from "nexus";

const User = objectType({
  name: 'User',
  definition(t : any) {
    t.string("id", { description: "User's Microsoft Graph id.", nullable: false });
    t.string("displayName", { description: "User's display name.", nullable: false });
    t.string("givenName", { description: "User's given name.", nullable: true });
    t.string("surname", { description: "User's surname.", nullable: true });
    t.string("userPrincipleName", { description: "User's principle name.", nullable: true });
    t.string("jobTitle", { description: "User's job title.", nullable: true });
    t.string("mail", { description: "User's email address.", nullable: true });
  },
});

export default User;