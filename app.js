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

//api call 1 /todos/?status=TO%20DO
app.get("/todos/", async (req, res) => {
  const { status } = req.query;
  const query = `
         SELECT * FROM todo
         WHERE status='${status}';`;
  const response = await db.all(query);
  res.send(response);
});

//api call 1.1
app.get("/todos/", async (req, res) => {
  const { priority } = req.query;
  const query = `
         SELECT * FROM todo
         WHERE priority='${priority}';`;
  const response = await db.all(query);
  res.send(response);
});

//api call 1.2
app.get("/todos/", async (req, res) => {
  const { priority, status } = req.query;
  console.log(priority);
  const query = `
         SELECT * FROM todo
         WHERE priority='${priority}' AND status='${status}';`;
  const response = await db.all(query);
  res.send(response);
});

//api call 1.3
app.get("/todos/", async (req, res) => {
  const { search_q } = req.query;
  const query = `
         SELECT * FROM todo
         WHERE todo LIKE '%${search_q}%';`;
  const response = await db.all(query);
  res.send(response);
});

//api call 2
app.get("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const query = `
         SELECT * FROM todo
         WHERE id=${todoId};`;
  const response = await db.all(query);
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
  const query = `
         UPDATE todo SET
         status="Done"
         WHERE id=${todoId};`;
  const response = await db.run(query);
  res.send("Status Updated");
});
//api call 4.2
app.put("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const query = `
         UPDATE todo SET
         priority="HIGH"
         WHERE id=${todoId};`;
  const response = await db.run(query);
  res.send("Priority Updated");
});

//api call 4.3
app.put("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;
  const query = `
         UPDATE todo SET
         todo="Some Task"
         WHERE id=${todoId};`;
  const response = await db.run(query);
  res.send("Todo Updated");
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
