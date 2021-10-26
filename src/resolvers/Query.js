import { getUserId } from "../utils/getUserId";

const Query = {
  async users(parent, args, { prisma }, info) {
    let query = "";
    if (args.query) {
      query = args.query;
    }
    const allUsers = prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
            },
          },
        ],
      },
      include: {
        posts: true,
      },
    });

    return allUsers;
  },
  posts(parent, args, { prisma }, info) {
    let query = "";
    if (args.query) {
      query = args.query;
    }
    const allPosts = prisma.post.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        author: true,
        comments: true,
      },
    });

    return allPosts;
  },
  comments(parent, args, { prisma }, info) {
    let query = "";
    if (args.query) {
      query = args.query;
    }
    const allComments = prisma.comment.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        author: true,
        post: true,
      },
    });

    return allComments;
  },
  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      throw new Error("Author not exists");
    }

    return user;
  },
  async post(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const post = await prisma.post.findMany({
      where: {
        id,
        OR: [
          {
            published: true,
          },
          {
            authorId: Number(userId),
          },
        ],
      },
      include: {
        author: true,
        comments: true,
      },
    });

    if (!post) throw new Error("Post not found");

    return post;
  },
};

export default Query;
