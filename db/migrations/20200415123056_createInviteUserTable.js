exports.up = function(knex) {
  return knex.schema.createTable("InvitedUser", InvitedUser => {
    InvitedUser.primary(["userId", "workspaceId", "email", "role"]);
    InvitedUser.integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("User")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    InvitedUser.integer("workspaceId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("Workspace")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    InvitedUser.string("email", 255).notNullable();
    InvitedUser.string("role", 255).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("InvitedUser");
};
