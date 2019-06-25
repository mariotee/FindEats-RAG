import gql from "graphql-tag"

export const queries = {
  GET_VISITED_PLACES: gql`
    query($userId: String!) {
      visitedPlaces(userId:$userId) {        
        place_id
      }
    }
  `
}

export const mutations = {
  CREATE_VISITED_PLACE: gql`
    mutation($visitedPlaceInput: VisitedPlaceInput!) {
      createVisitedPlace(visitedPlaceInput:$visitedPlaceInput) {        
        userId
        place_id
        name
      }
    }
  `,
  REMOVE_VISITED_PLACE: gql`
    mutation($visitedPlaceInput: VisitedPlaceInput!) {
      removeVisitedPlace(visitedPlaceInput:$visitedPlaceInput) {
        userId
        place_id
        name
      }
    }
  `
}