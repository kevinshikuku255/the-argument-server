const dotenv = require( 'dotenv');
const  mongoose = require( 'mongoose');
const express =require('express');
const { createServer } = require('http');
const cors =require( "cors");


const resolvers =  require("./resolvers/index.js");
const schema = require("./schema");
const createApolloServer = require("./utils/apollo_server");
dotenv.config();


/* ----------Connect to database---------------------------------------------------------------- */
mongoose.set('useFindAndModify', false);
mongoose
  .connect(process.env.DB_URL, {
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



httpServer.listen(process.env.PORT, () => {
  console.log(` 🚀  server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
  console.log(` 🚀  Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`);
});
