import { APP_SECRET, getVerified } from './../utils';
import { Prisma } from './../../prisma/generated/prisma-client/index';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const signup = async (parent, args, context, info) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const password = await bcrypt.hash(args.password, salt);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

export const login = async (parent, args, context) => {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error('no such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('invalid password');
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

export const post = (parent, args, context, info) => {
  const userObject = getVerified(context);
  const id = (userObject as any).userId; // alternative: (<any>userObject).userId

  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id } }
  });
};

export const vote = async (parent, args, context: { prisma: Prisma }, info) => {
  const userObject = getVerified(context);
  const id = (userObject as any).userId;

  // check if current user has already voted for specific link
  // checks if a vote object has a user and link with the IDs given
  const linkExists: boolean = await context.prisma.$exists.vote({
    user: { id },
    link: { id: args.linkId }
  });

  if (linkExists) {
    throw new Error(`Already voted for this link: ${args.linkId}`);
  }
  // if exists returns false, the createVote method is called to create a new Vote thats connected to the User and the Link
  return context.prisma.createVote({
    link: { connect: { id: args.linkId } },
    user: { connect: { id } }
  });
};
