const {Schema, model} = require("mongoose")

module.exports = model("User", new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  visitedPlaces: {
    type: [Schema.Types.ObjectId],
    ref: "VisitedPlace",
  },
}), "Users")