const  mongoose = require( 'mongoose');
const express =require('express');
const { createServer } = require('http');
const cors =require( "cors");

const   {  DB_URL, PORT } = require("./config/env.json");

const resolvers =  require("./resolvers/index.js");
const schema = require("./schema");
const createApolloServer = require("./utils/apollo_server");



/* ----------Connect to database---------------------------------------------------------------- */
mongoose.set('useFindAndModify', false);
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log(' connected to database'))
  .catch(err => console.error(err));

// Initializes application
const app = express();


/**  Enables cors */
const corsOptions = {
  origin: "*",
  credentials: true  // <-- REQUIRED backend setting
};

app.use(cors(corsOptions))


/* -----------Create a Apollo Server--------------------------------------------------------------- */
const server = createApolloServer(schema, resolvers);
server.applyMiddleware({
          app,
          path:'/graphql',
          cors:false ,
          bodyParserConfig: {
            limit:"50mb"
          }
          });

// Create http server and add subscriptions to it
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);



httpServer.listen(PORT, () => {
  console.log(` 🚀  server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(` 🚀  Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
