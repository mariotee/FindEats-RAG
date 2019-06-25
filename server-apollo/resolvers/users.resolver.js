const bcrypt = require("bcryptjs")

const UserModel = require("../models/user.model")

module.exports.query = {
  user: async (root,args) => {
    return await UserModel.findById(args.id)
  }
}

module.exports.mutation = {
  // createUser: async (root, args) => {
  //   console.log(args)
  //   let hash = await bcrypt.hash(args.userInput.password,12)
  //   let user = await UserModel.create({
  //     email: args.userInput.email,
  //     password: hash,
  //     //visitedPlaces: []
  //   })

  //   return {
  //     id: user._id,
  //     email: user.email,
  //     password: null,
  //   }
  // },
}