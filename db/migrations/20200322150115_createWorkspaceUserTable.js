exports.up = function(knex) {
  return knex.schema.createTable("Workspace_User", Workspace_User => {
    Workspace_User.primary(["workspaceId", "userId"]);
    Workspace_User.integer("workspaceId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("Workspace")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    Workspace_User.integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("User")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    Workspace_User.string("role", 255).notNullable();
    Workspace_User.datetime("lastSeen");
    Workspace_User.string("status", 255)
      .defaultTo("active")
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Workspace_User");
};
