const { SQLDataSource } = require("datasource-sql");
const { knexConfig } = require("../../db/dbConfig");

const MINUTE = 60;
const TABLE = "WorkspaceUser";

class WorkspaceUserAPI extends SQLDataSource {
  async createWorkspaceUser() {}

  readWorkspaceUser(whereObj) {}

  updateWorkspaceUser(whereObj, workspaceUser) {}

  deleteWorkspaceUser(whereObj) {}

  async _createWorkspaceUser() {}

  _readWorkspaceUser(whereObj) {}

  _updateWorkspaceUser(whereObj, workspaceUser) {}

  _deleteWorkspaceUser(whereObj) {}
}

module.exports = new WorkspaceUserAPI(knexConfig);
