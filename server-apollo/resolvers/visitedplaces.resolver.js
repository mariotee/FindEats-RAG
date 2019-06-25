const VisitedPlacesModel = require("../models/visitedplaces.model")

module.exports.query = {
  visitedPlaces: async (root,args) => {
    return await VisitedPlacesModel.find({
      userId: args.userId,
    })
  }
}

module.exports.mutation = {
  createVisitedPlace: async (root,args) => {
    let place = await VisitedPlacesModel.create({
      userId: args.visitedPlaceInput.userId,
      place_id: args.visitedPlaceInput.place_id,
      name: args.visitedPlaceInput.name,
    })

    return {
      id: place._id,
      userId: place.userId,
      place_id: place.place_id,
      name: place.name
    }
  },
  removeVisitedPlace: async (root,args) => {
    let place = await VisitedPlacesModel.findOneAndDelete({
      userId: args.visitedPlaceInput.userId,
      place_id: args.visitedPlaceInput.place_id,
    })
    return {
      id: place._id,
      userId: place.userId,
      place_id: place.place_id,
      name: place.name,
    }
  }
}
