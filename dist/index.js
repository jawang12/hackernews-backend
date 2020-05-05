"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const typeDefs = apollo_server_express_1.gql `
  type Query {
    hello: String!
  }
`;
const resolvers = {
    Query: {
        hello: () => 'hello everybody!'
    }
};
const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
const app = express_1.default();
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
//# sourceMappingURL=index.js.map