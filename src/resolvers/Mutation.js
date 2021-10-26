import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserId } from "../utils/getUserId";

const Mutation = {
  async login(parent, { data }, { prisma }, info) {
    const { password, email } = data;

    console.log("password", password);
    console.log("email", email);
    const hash = await bcrypt.hash(password, 10);
    console.log("hash", hash);
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: data.email.toLowerCase().trim(),
        },
      },
    });

    if (!user) {
      throw new Error("Username or Password does not match not found.");
    }

    console.log("login user ", user);
    const isPswMatch = await bcrypt.compare(password, user.password);
    console.log("isPswMatch", isPswMatch);

    if (!isPswMatch) {
      throw new Error("Username or Password does not match not found.");
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, {
        expiresIn: "100 seconds",
      }),
    };
  },

  async createUser(parent, { data }, { prisma }, info) {
    const { password } = data;
    console.log("password", password);

    if (password.length < 8) {
      throw new Error("Password must be 8 characters or longer.");
    }

    const hash = await bcrypt.hash(password, 10);
    console.log("hash", hash);
    const emailTaken = await prisma.user.findFirst({
      where: {
        email: {
          contains: data.email.toLowerCase().trim(),
        },
      },
    });

    console.log("emailTaken", emailTaken);
    if (emailTaken) {
      throw new Error("Email taken.");
    }

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hash,
      },
    });

    console.log("new user ", user);

    return { user, token: jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET) };
  },

  async createComment(parent, args, { prisma, pubsub, request }, info) {
    const { title, body, published, post } = args.data;
    const userId = getUserId(request);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new Error("Author not exists");
    }

    const postExists = await prisma.post.findUnique({
      where: {
        id: Number(post),
      },
    });

    if (!postExists) {
      throw new Error("Post not exists.");
    }

    const comment = await prisma.comment.create({
      data: {
        title,
        body,
        published,
        authorId: Number(userId),
        postId: Number(post),
      },
      include: {
        author: true,
      },
    });

    pubsub.publish(`comment`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },

  async createPost(parent, args, { db, prisma, pubsub, request }, info) {
    console.log("request 10", request.request.headers.authorization);
    const { title, body, published, author } = args.data;
    const userId = getUserId(request);

    const post = await prisma.post.create({
      data: {
        title,
        body,
        published,
        authorId: Number(userId),
      },
      include: {
        author: true,
      },
    });

    pubsub.publish(`post`, {
      post: {
        mutation: "CREATED",
        data: post,
      },
    });

    return post;
  },

  updateUser(parent, args, { prisma, request }, info) {
    const { data } = args;
    const userId = getUserId(request);
    return prisma.user.update({
      where: {
        id: Number(userId),
      },
      data,
    });
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    console.log("findUnique", user);
    if (!user) {
      throw new Error("User not found");
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    console.log("deletedUser", deletedUser);

    return user;
  },
};

export default Mutation;
