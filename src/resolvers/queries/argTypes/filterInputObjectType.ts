import { inputObjectType } from "nexus";
import logicType from "./logicType";
import userFilterFieldType from "./userFilterFieldType";

const filter = inputObjectType(
    {
      name: "filter",
      definition(t) {
        t.field("field", {type: userFilterFieldType, required: true, description: "The field to filter by"});
        t.field("type", {type: logicType, required: true, description: "the filtering method to be used"});
        t.string("value", {required: true, description: "The value to compare to"});

      }
    }
  );



export default filter;