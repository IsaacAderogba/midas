exports.up = function (knex) {
  return knex.schema.createTable("Project", (Project) => {
    Project.increments();
    Project.string("uuid", 255).notNullable().unique();
    Project.integer("workspaceId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("Workspace")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    Project.integer("workspaceUserId")
      .unsigned()
      .references("id")
      .inTable("Workspace_User")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    Project.string("title", 256).notNullable();
    Project.string("thumbnailPhotoURL", 510);
    Project.string("thumbnailPhotoID", 256);
    Project.string("inviteShareStatus", 128)
      .notNullable()
      .defaultTo("people_invited");
    Project.string("inviteSharePrivileges", 128)
      .notNullable()
      .defaultTo("can_view");
    Project.text("elements", ["longText"]);
    Project.text("state");
    Project.datetime("createdAt").notNullable();
    Project.datetime("updatedAt").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Project");
};
