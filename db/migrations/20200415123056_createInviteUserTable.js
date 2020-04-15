exports.up = function (knex) {
  return knex.schema.createTable(
    "InvitedWorkspaceUser",
    (InvitedWorkspaceUser) => {
      InvitedWorkspaceUser.primary([
        "workspaceUserId",
        "workspaceId",
        "email",
        "role",
      ]);
      InvitedWorkspaceUser.integer("workspaceUserId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("Workspace_User")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      InvitedWorkspaceUser.integer("workspaceId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("Workspace")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      InvitedWorkspaceUser.string("email", 255).notNullable();
      InvitedWorkspaceUser.string("role", 255).notNullable();
    }
  );
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("InvitedWorkspaceUser");
};
