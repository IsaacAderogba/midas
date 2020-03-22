exports.up = function(knex) {
  return knex.schema.createTable("User", User => {
    User.increments();
    User.string("firstName", 255).notNullable();
    User.string("lastName", 255).notNullable();
    User.string("email", 255)
      .notNullable()
      .unique();
    User.string("password", 255).notNullable();
    User.string("avatarURL", 510);
    User.boolean("isVerified")
      .defaultTo(false)
      .notNullable();
    User.string("photoId", 255);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("User");
};
