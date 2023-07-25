const express = require("express");

const app = express();

app.use(express.json());

const sqlite = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const filePath = path.join(__dirname, "todoApplication.db");

let db = null;

const dbServerToDatabase = async () => {
  try {
    db = await sqlite.open({
      filename: filePath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.log(e.message);
  }
};
dbServerToDatabase();

app.listen(3000, () => {
  console.log("server is running");
});

//api call 1
app.get("/todos/", async (req, res) => {
  const { todo, priority, status, search_q } = req.query;
  if (priority !== undefined && status !== undefined) {
    const query = `
         SELECT * FROM todo
         WHERE priority='${priority}' AND status='${status}';`;
    const response = await db.all(query);
    res.send(response);
  } else if (status !== undefined) {
    const query = `
      SELECT * FROM todo
         WHERE status='${status}';`;
    const response = await db.all(query);
    res.send(response);
  } else if (priority !== undefined) {
    const query = `
      SELECT * FROM todo
         WHERE priority='${priority}';`;
    const response = await db.all(query);
    res.send(response);
  } else if (search_q !== undefined) {
    const query = `
         SELECT * FROM todo
         WHERE todo LIKE '%${search_q}%';`;
    const response = await db.all(query);
    res.send(response);
  } else {
    const query = `
         SELECT * FROM todo;`;
    const response = await db.all(query);
    res.send(response);
  }
});

//api call 2
app.get("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const query = `
         SELECT * FROM todo
         WHERE id=${todoId};`;
  const response = await db.get(query);
  res.send(response);
});

//api call 3

app.post("/todos/", async (req, res) => {
  const { id, todo, priority, status } = req.body;
  const query = `
               INSERT INTO todo(id,todo,priority,status)
               VALUES
               (${id},'${todo}','${priority}','${status}');`;
  const response = await db.run(query);
  res.send("Todo Successfully Added");
});

//api call 4.1
app.put("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const { status, priority, todo } = req.body;
  //console.log(status, priority, todo);
  if (status !== undefined) {
    const query = `
         UPDATE todo SET
         status='${status}'
         WHERE id=${todoId};`;
    const response = await db.run(query);
    res.send("Status Updated");
  } else if (priority !== undefined) {
    const query = `
         UPDATE todo SET
         priority= '${priority}'
         WHERE id=${todoId};`;
    const response = await db.run(query);
    res.send("Priority Updated");
  } else if (todo !== undefined) {
    const query = `
         UPDATE todo SET
         todo='${todo}'
         WHERE id=${todoId};`;
    const response = await db.run(query);
    res.send("Todo Updated");
  }
});

//api call 5

app.delete("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const query = `
         DELETE FROM todo
          WHERE id=${todoId};`;
  const response = await db.run(query);
  res.send("Todo Deleted");
});

module.exports = app;
