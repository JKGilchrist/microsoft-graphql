import { queryType } from 'nexus';

// Adding this to your types makes sure that only explicitely defined
// queries are shown in the schema
const Query = queryType({
  definition(t) {}
});

export default Query;