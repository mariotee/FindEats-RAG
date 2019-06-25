const UsersResolver = require("./users.resolver")
const VisitedPlacesResolver = require("./visitedplaces.resolver")

module.exports = {
  Query: {
    ...UsersResolver.query,
    ...VisitedPlacesResolver.query,
  },
  Mutation: {
    ...UsersResolver.mutation,
    ...VisitedPlacesResolver.mutation
  }
}