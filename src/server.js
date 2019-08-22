require("dotenv").config();

const PORT = process.env.PORT || 4000;

import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";

const typeDefs = `
    type Query{
        hello: String!
    }
`;

const resolvers = {
  Query: {
    hello: () => "hi"
  }
};
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.express.use(logger("dev"));

server.start({port:PORT}, () => console.log("Server is running on http://localhost:"+ PORT));
