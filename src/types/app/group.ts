import { objectType } from "nexus";
import User from "./user";

const Group = objectType({
  name: 'Group',
  definition(t : any) {
    t.string("id", { description: "Group's Microsoft Graph id.", nullable: false });
    t.string("displayName", { description: "Group's display name.", nullable: false });
    t.string("description", { description: "Group's description.", nullable: false });
    
    t.list.field("members", { type: User, description: "Group's members.", nullable: false });
  },
});

export default Group;