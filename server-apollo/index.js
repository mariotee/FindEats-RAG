const express = require("express")
const mongoose = require("mongoose")
const {ApolloServer} = require("apollo-server-express")
const typeDefs = require("./schema")
const resolvers = require("./resolvers")

const apollo = new ApolloServer({typeDefs,resolvers})
const app = express()
apollo.applyMiddleware({app})

console.log("attempting to connect to database...")
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,
})
.then(() => {
  console.log("successfully connected to database!")
  for(const signal of ["exit", "SIGINT"]) {
    process.on(signal, () => {
      console.log("closing database...")
      mongoose.connection.close(() => {
          console.log("successfully disconnected")          
          process.exit(0)
      })
    })
  }

  app.listen(4000, () => {
    console.log(`listening on PORT 4000; endpoint = ${apollo.graphqlPath}`)
  })
})
.catch((err)=> {
  console.log(err)
})
