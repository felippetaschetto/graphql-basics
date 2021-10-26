import { GraphQLServer, PubSub } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { resolvers } from "./resolvers";

const pubsub = new PubSub();

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context(request) {
    return { pubsub, prisma, request };
  },
});

export { server as default };
