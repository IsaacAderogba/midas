const { db } = require("../../../db/dbConfig");
const UserAPI = require("../../resources/user/userDataSource");

const seededUser = {
  input: {
    firstName: "Isaac",
    lastName: "Aderogba",
    email: "isaacaderogba1@gmail.com",
    password: "password",
  },
  user: undefined,
};

const seedDatabase = async () => {
  await db("User").delete();
  seededUser.user = await UserAPI.registerUser(seededUser.input);
};

module.exports = {
  seedDatabase,
  seededUser,
};
