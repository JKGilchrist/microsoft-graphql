import { inputObjectType } from "nexus";

const filterer = inputObjectType(
    {
      name: "filter",
      definition(t) {
        t.string("field", {required: true, description: "The field to filter by"}),
        t.string("startsWith", {required: true, description: "The value said field should begin with"})
      }
    }
  );

  export default filterer;