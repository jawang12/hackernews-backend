import { Prisma } from './../../prisma/generated/prisma-client/index';
const newLinkSubscribe = (parent, args, context, info) =>
  context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node();

export const newLink = {
  subscribe: newLinkSubscribe,
  resolve: payload => payload
};

// returns the vote object/node { id, user, link }
const subToNewVote = (parent, args, context: { prisma: Prisma }, info) =>
  context.prisma.$subscribe.vote({ mutation_in: ['CREATED'] }).node();

export const newVote = {
  subscribe: subToNewVote,
  resolve: payload => payload
};
