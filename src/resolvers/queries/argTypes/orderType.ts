import { enumType } from "nexus/dist";

const orderType = enumType({
    name: "order",
    members: {
        ASCENDING: "ASC",
        DESCENDING: "DESC"
    },
});

export default orderType;


