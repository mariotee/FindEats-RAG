const {Schema, model} = require("mongoose")

module.exports = model("VisitedPlace", new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  place_id: {
    type: "String",
    required: true,
  },
  name: {
    type: "String",
    required: false,
  }
}), "VisitedPlaces")