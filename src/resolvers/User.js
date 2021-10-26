import { getUserId } from "../utils/getUserId";

const User = {
  posts: {
    fragment: "fragment userId on User { id }",
    resolve(user, ars, { prisma, request }, info) {
      console.log("POSTSSSSS");

      return prisma.post.findMany({
        where: {
          published: true,
          authorId: user.id,
        },
        include: {
          author: true,
          comments: true,
        },
      });
    },
  },

  email: {
    fragment: "fragment userId on User { id }",
    resolve(user, ars, { request }, info) {
      const userId = getUserId(request, false);

      if (userId && userId === user.id) {
        return user.email;
      }

      return null;
    },
  },

  // posts(parent, args, { db }, info) {
  //   return db.posts.filter((post) => post.author === parent.id);
  // },
  // comments(parent, args, { db }, info) {
  //   return db.comments.filter((post) => post.author === parent.id);
  // },
};

export default User;
