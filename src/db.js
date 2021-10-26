const users = [
  {
    id: "1",
    name: "User 1",
    email: "email1@email.com",
    age: 10,
  },
  {
    id: "2",
    name: "User 2",
    email: "email2@email.com",
  },
  {
    id: "3",
    name: "User 3",
    email: "email3@email.com",
  },
];

const posts = [
  {
    id: "111",
    title: "title post 1",
    body: "body 1",
    published: true,
    author: "1",
  },
  {
    id: "222",
    title: "title post 2",
    body: "body 2",
    published: true,
    author: "1",
  },
  {
    id: "333",
    title: "title post 3",
    body: "body 3",
    published: false,
    author: "2",
  },
];

const comments = [
  {
    id: "10",
    text: "Comment 10",
    author: "1",
    post: "111",
  },
  {
    id: "11",
    text: "Comment 11",
    author: "1",
    post: "111",
  },
  {
    id: "12",
    text: "Comment 12",
    author: "2",
    post: "222",
  },
  {
    id: "13",
    text: "Comment 13",
    author: "3",
    post: "333",
  },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
