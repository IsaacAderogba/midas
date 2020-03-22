exports.up = function(knex) {
  return knex.schema.createTable("Workspace", Workspace => {
    Workspace.increments();
    Workspace.string("name", 255).notNullable();
    Workspace.string("url", 255)
      .notNullable()
      .unique();
    Workspace.string("photoURL", 510);
    Workspace.string("photoId", 255);
    Workspace.datetime("trialStartedAt").notNullable();
    Workspace.string("seats").defaultTo(1);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Workspace");
};
