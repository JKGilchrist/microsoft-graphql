import { objectType, arg } from "nexus";
import User from "./user";
import orderBy from "../filters/orderByInputObjectType";

const Group = objectType({
  name: 'Group',
  definition(t : any) {
    t.string("id", { description: "Group's Microsoft Graph id.", nullable: false });
    t.string("createdDateTime", {nullable: false,});
    t.string("description", { description: "Group's description.", nullable: false });
    t.string("displayName", { description: "Group's display name.", nullable: false });
    t.string("mail", {nullable: true, });
    t.string("mailNickname", {nullable:true, });
    t.string("visibility", {nullable: true}); //Some like for company administrator and appplication developer are null

    t.list.field("members", { 
      type: User, 
      args: {
        orderBy: arg({type: orderBy, required: false, description: ""}),
      },
      description: "Group's members.", 
      nullable: false 
    });
  },
});

export default Group;