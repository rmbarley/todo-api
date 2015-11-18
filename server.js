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
  var body = _.pick(req.body, "description", "completed");

  // Validate and mung data
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  return res.status(400).send();
  }

  body.description = body.description.trim();

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

// PUT /todos/:id
app.put("/todos/:id", function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  var body = _.pick(req.body, "description", "completed");
  var validAttributes = {};

  if (!matchedTodo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty("completed")) {
    // Something bad happened
    return res.status(400).send();
  }

  if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty("description")) {
    return res.status(400).send();
  }

  // HERE
  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});

app.listen(PORT, function () {
  console.log("Express is listening on port: " + PORT + ".");
});