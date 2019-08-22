import { enumType } from "nexus/dist";

const userFilterFieldType = enumType({
    name: "userFilterFieldType",
    members: ["displayName", "givenName", "surName", "userPrincipalName","jobTitle", "mail"]

     /*
        All userFilterFieldTypes          filterable
        id                    N
        displayName           Y
        givenName             Y
        surname               Y
        userPrincipalName     Y
        jobTitle              Y
        mail                  Y
        group                 -
        type                  N
    */

});

export default userFilterFieldType;