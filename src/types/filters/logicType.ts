import { enumType } from "nexus/dist";

const logicType = enumType({
    name: "type",
    members: {
        EQUAL: "eq", 
        NOT_EQUAL: "ne",
        GREATER_THAN: "gt",
        GREATER_THAN_OR_EQUAL: "ge",
        LESS_THAN: "lt", 
        LESS_THAN_OR_EQUAL: "le",
        STARTS_WITH: "startsWith"

    //TODO what about and, or, not
    }
});

export default logicType;


