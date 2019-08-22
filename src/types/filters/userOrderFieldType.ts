import { enumType } from "nexus/dist";

const userOrderFieldType = enumType({
    name: "userOrderFieldType",
    members: ["displayName", "userPrincipalName"] //currently the only ones supported 
    //TODO Maybe tack our own on? givenName and surname are easily retrievable from displayName. In fact, using it with startsWith makes givenName accessible


});

export default userOrderFieldType;