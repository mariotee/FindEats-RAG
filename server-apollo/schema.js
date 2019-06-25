const {gql} = require("apollo-server-express")

module.exports = gql`
  type Query {
    user(id:String!): User
    visitedPlaces(userId:String!): [VisitedPlace!]!
  }

  type Mutation {
    createUser(userInput:UserInput!): User!
    createVisitedPlace(visitedPlaceInput: VisitedPlaceInput!): VisitedPlace!
    removeVisitedPlace(visitedPlaceInput: VisitedPlaceInput!): VisitedPlace!
  }

  type User {
    id: ID!
    email: String!
    password: String
    visitedPlaces: [VisitedPlace!]!
  }

  input UserInput {    
    email: String!
    password: String!
  }

  type VisitedPlace {
    id: ID!
    userId: ID!
    place_id: String!
    name: String
  }

  input VisitedPlaceInput {
    userId: String!
    place_id: String!
    name: String
  }
`