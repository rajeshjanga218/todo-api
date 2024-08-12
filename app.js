import express from "express";
import { posts } from "./constants.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/posts", (req, res) => {
  const { query, sort } = req.query;
  let filteredPosts = posts;
  if (query) {
    filteredPosts = posts.filter((post) =>
      post.title
        .toLocaleLowerCase()
        .includes(decodeURIComponent(query).toLocaleLowerCase())
    );
  }

  switch (sort) {
    case "id":
      filteredPosts = filteredPosts.sort((a, b) => a.id - b.id);
      break;
    case "name":
      filteredPosts = filteredPosts.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;
    case "age":
    //  need to write
    default:
      filteredPosts = filteredPosts.sort((a, b) => a.id - b.id);
      break;
  }
  res.json(filteredPosts);
});

app.get("/post/:id", (req, res) => {
  const { id } = req.params;
  const [post] = posts.filter((post) => post.id === parseInt(id));
  if (!post) return res.status(404).send("Post not found.");
  res.json(post);
});

app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  let lastPostId = posts[posts.length - 1].id;

  const newPost = {
    id: lastPostId < 1 ? 0 : lastPostId + 1,
    title,
    content,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.put("post/:id", (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const post = posts.find((post) => post.id === parseInt(id));

  if (!post) return res.status(404).send("Item Not Found");

  post.title = title;
  post.content = content;
  res.json(post);
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  const indexOfPost = posts.findIndex((post) => post.id === parseInt(id));

  if (indexOfPost === -1) {
    return res.status(404).send("Item Not Found");
  }

  const [deletedPost] = posts.splice(indexOfPost, 1);

  res.status(200).json(deletedPost);
});

export default app;
