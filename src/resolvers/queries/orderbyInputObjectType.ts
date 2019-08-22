import { inputObjectType } from "nexus";

const orderby = inputObjectType(
    {
      name: "filter",
      definition(t) {
        t.string("field", {required: true, description: "The field(s?TODO) to order by"}),
        t.boolean("ascending", {required: false, description: "Ascending or descending order, the former is the default"})
      }
    }
  );

  export default orderby;