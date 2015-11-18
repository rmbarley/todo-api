// Despendencies
var bodyParser = require("body-parser");
var express = require("express");
var _ = require("underscore");

var app = express();
var PORT = process.env.PORT || 3000;
var todos = []
var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Todo API ROOT");
});

// GET /todos
app.get("/todos", function (req, res) {
  res.json(todos);
});

// GET /todos/:id
app.get("/todos/:id", function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post("/todos", function (req, res) {
  var body = req.body;
  // Validate and mung data
  body = _.pick(body, "description", "completed");
  body.description = body.description.trim();
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();

  }
  //add id field
  body.id = todoNextId;
  todoNextId++;
  // push body into array
  todos.push(body);

  res.json(body);
});

// Delete /todos/:id
app.delete("/todos/:id", function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (!matchedTodo) {
    res.status(404).json({"error": "no item found with that id."});
  } else {
    todos = _.without(todos, matchedTodo);
    res.send("Item was deleted successfully.");
  }
});

app.listen(PORT, function () {
  console.log("Express is listening on port: " + PORT + ".");
});