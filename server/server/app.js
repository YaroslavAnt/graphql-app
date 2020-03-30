const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("../schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3005;

mongoose.connect(
  "mongodb+srv://YaroslavAnt:19860401@cluster0-1dbqr.mongodb.net/graphQL?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.use(cors);

const dbConnection = mongoose.connection;
dbConnection.on("error", err => console.log("Error", err));
dbConnection.once("open", () => console.log("Connected to db"));

app.listen(PORT, err => {
  err ? console.log(err) : console.log("Server started");
});
