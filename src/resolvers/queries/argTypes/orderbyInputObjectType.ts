import { inputObjectType } from "nexus";
import userOrderFieldType from "./userOrderFieldType";
import orderType from "./orderType";

const orderBy = inputObjectType(
    {
      name: "orderBy",
      definition(t) {
        t.field("field", {type: userOrderFieldType, required: true, description: "The field(s?TODO) to order by"});
        t.field("orderStyle", {type: orderType, required: false, description: "Ascending or descending order, the former is the default"});
      }
    }
  );

  export default orderBy;