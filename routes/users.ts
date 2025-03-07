import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from "../models/users";
import { basicAuth } from "../controllers/auth";

// Since we are handling users use a URI that begins with an appropriate path
const router = new Router({ prefix: "/api/v1/users" });
// Temporarily define some random users in an array.
// Later this will come from the DB.
const users = [
  { title: "hello article", fullText: "some text here to fill the body" },
  {
    title: "another article",
    fullText: "again here is some text here to fill",
  },
  {
    title: "coventry university ",
    fullText: "some news about coventry university",
  },
  { title: "smart campus", fullText: "smart campus is coming to IVE" },
];

interface User {
  title: string;
  alltext: string;
  summary: string;
  imageurl: string;
  published: boolean;
  authorid: number;
}

// Now we define the handler functions
const getAll = async (ctx: RouterContext, next: any) => {
  let users = await model.getAll();
  if (users.length) {
    ctx.body = users;
  } else {
    ctx.body = {};
  }
  await next();
};
const getById = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  let user = await model.getById(id);

  if (user.length) {
    ctx.body = user[0];
  } else {
    ctx.status = 404;
  }
  await next();
};

const createUser = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body;
  let result = await model.add(body);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "insert data failed" };
  }
  await next();
};
const updateUser = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  let user = await model.getById(id);

  if (user.length) {
    const body = ctx.request.body;
    let result = await model.update(id, body);

    if (result.status == 200) {
      ctx.status = 200;
      ctx.body = { id: id, body: body };
    } else {
      ctx.status = 500;
      ctx.body = { err: "update data failed" };
    }
  } else {
    ctx.status = 404;
  }
  await next();
};
const deleteUser = async (ctx: RouterContext, next: any) => {
  let id = +ctx.params.id;
  let user = await model.getById(id);
  if (user.length) {
    let result = await model.remove(id);

    if (result.status == 200) {
      ctx.status = 200;
      ctx.body = `Removed user with id ${id}`;
    } else {
      ctx.status = 500;
      ctx.body = { err: "delete data failed" };
    }
  } else {
    ctx.status = 500;
    ctx.body = { err: "delete data failed" };
  }

  //   if (id <= articles.length && id > 0) {
  //     articles.splice(id - 1, 1);
  //     ctx.body = {
  //       message: `Removed article with id ${id}`,
  //     };
  //   } else {
  //     ctx.status = 404;
  //   }

  await next();
};
/* Routes are needed to connect path endpoints to handler functions.
 When an Article id needs to be matched we use a pattern to match
 a named route parameter. Here the name of the parameter will be 'id'
 and we will define the pattern to match at least 1 numeral. */
router.get("/", basicAuth, getAll);
router.post("/", bodyParser(), basicAuth, createUser);
router.get("/:id([0-9]{1,})", basicAuth, getById);
router.put("/:id([0-9]{1,})", bodyParser(), basicAuth, updateUser);
router.del("/:id([0-9]{1,})", basicAuth, deleteUser);
// Finally, define the exported object when import from other scripts.
export { router };
