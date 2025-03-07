import * as db from "../helpers/database";

export const findByUsername = async (username: any) => {
  const query = "SELECT * from users where username = ?";
  const user = await db.run_query(query, [username]);
  return user;
};

//get a single user by its id
export const getById = async (id: any) => {
  let query = "SELECT * FROM users WHERE ID = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
};
//list all the users in the database
export const getAll = async () => {
  // TODO: use page, limit, order to give pagination
  let query = "SELECT * FROM users;";
  let data = await db.run_query(query, null);
  return data;
};
//create a new user in the database
export const add = async (user: any) => {
  let keys = Object.keys(user);
  let values = Object.values(user);
  let key = keys.join(",");
  let param = "";
  for (let i: number = 0; i < values.length; i++) {
    param += "?,";
  }
  param = param.slice(0, -1);
  let query = `INSERT INTO users (${key}) VALUES (${param})`;
  try {
    await db.run_insert(query, values);
    return { status: 201 };
  } catch (err: any) {
    return err;
  }
};

export const update = async (id: any, user: any) => {
  let keys = Object.keys(user);
  let values = Object.values(user);
  let setClause = keys.map((key) => `${key} = ?`).join(", ");
  let query = `UPDATE users SET ${setClause} WHERE ID = ?`;
  values.push(id); // Add the id to the values array for the WHERE clause
  try {
    await db.run_update(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
};

export const remove = async (id: any) => {
  let query = "DELETE FROM users WHERE ID = ?";
  let values = [id];
  try {
    await db.run_delete(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
};
