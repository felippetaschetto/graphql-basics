import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const client = new ApolloBoost({
  uri: "http://localhost:4000",
});

const prisma = new PrismaClient();

describe("User Case Tests", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        name: "Dummmy User",
        email: "dummy@user.com",
        password: bcrypt.hashSync("password123"),
      },
    });

    await prisma.post.create({
      data: {
        title: "My Publised Post",
        body: "Post Publised Body",
        published: true,
        authorId: user.id,
      },
    });
    await prisma.post.create({
      data: {
        title: "My Draft Post",
        body: "Post Draft Body",
        published: false,
        authorId: user.id,
      },
    });
  });

  it("Should create a new user", async () => {
    const email = "test@user.com";
    const creteUser = gql`
      mutation {
        createUser(
          data: {
            name: "Test User"
            email: "${email}"
            password: "10203040"
          }
        ) {
          user {
            id
            name
            email
          }
          token
        }
      }
    `;
    const response = await client.mutate({
      mutation: creteUser,
    });

    //console.log("response", response);

    const newUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    expect(newUser).not.toBe(null);
  });

  it("Should return a user", async () => {
    const getUsers = gql`
      query {
        users {
          id
          name
          email
        }
      }
    `;

    const response = await client.query({
      query: getUsers,
    });

    console.log("response", response);

    expect(response.data.users.length).toBe(1);
  });

  it("Should NOT login with bad credentials", async () => {
    const login = gql`
      mutation {
        login(data: { email: "fail@fail.com", password: "abcdefghi" }) {
          token
        }
      }
    `;

    await expect(
      client.mutate({
        mutation: login,
      })
    ).rejects.toThrow();
  });
});
