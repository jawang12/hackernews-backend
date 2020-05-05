import { user, link } from './resolvers/Vote';
import { newLink, newVote } from './resolvers/Subscription';
import { postedBy, votes } from './resolvers/Link';
import { links } from './resolvers/User';
import { signup, login, post, vote } from './resolvers/Mutation';
import { feed, singleLink } from './resolvers/Query';
import { prisma } from './../prisma/generated/prisma-client/index';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';

import { typeDefs } from './schema/typeDefs';

interface Link {
  id: string;
  description: string;
  url: string;
}
/*
const resolvers = {
  // properties in the resolver object are named after the root type / type
  Query: {
    // properties in types always have to be named after their corresponding field from the typeDef schema
    info: () => 'This is the API of a HackerNews Clone',
    feed: (root, args, context, info) => context.prisma.links()
  },
  Mutation: {
    post: (_, args, context, info) =>
      context.prisma.createLink({
        url: args.url,
        description: args.description
      })
  }

  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url
  }
  can be omitted because GQL server infers what it looks like.
};
*/

// async function main() {
//   const newLink = await prisma.createLink({ url: 'screenrant.com', description: 'Get the latest scoop on new movies and tv shows' });
//   console.log(`Created new link: ${newLink.url} at ${newLink.createdAt} with an id of ${newLink.id}`);

//   const allLinks = await prisma.links();
//   console.log(allLinks);
// }

const resolvers = {
  Query: {
    feed,
    singleLink
  },
  Mutation: {
    signup,
    login,
    post,
    vote
  },
  Subscription: {
    newLink,
    newVote
  },
  User: {
    links
  },
  Link: {
    postedBy,
    votes
  },
  Vote: {
    user,
    link
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, prisma })
});

const app = express();

server.applyMiddleware({ app });

// http server is created to handle the web socket interface to the subscription service
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(
    `🚀 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`
  );
});

// main().catch(error => console.error(error));
