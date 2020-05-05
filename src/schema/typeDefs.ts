import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    info: String! # root field
    feed(
      filter: String
      skip: Int
      first: Int
      orderBy: LinkOrderByInput
    ): Feed!
    singleLink(id: ID!): Link!
  }

  type Mutation {
    post(url: String!, description: String!): Link!
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    vote(linkId: ID!): Vote
  }

  type Subscription {
    newLink: Link
    newVote: Vote
  }

  type Link {
    id: ID!
    description: String!
    url: String!
    postedBy: User
    votes: [Vote!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    links: [Link!]!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Vote {
    id: ID!
    user: User!
    link: Link!
  }

  type Feed {
    count: Int!
    links: [Link!]!
  }

  enum LinkOrderByInput {
    description_ASC
    desciprtion_DESC
    url_ASC
    url_DESC
    createedAt_ASC
    createdAt_DESC
  }
`;
