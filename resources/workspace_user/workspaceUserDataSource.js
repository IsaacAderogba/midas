const { SQLDataSource } = require("datasource-sql");
const { knexConfig } = require("../../db/dbConfig");

// const WORKSPACE_TABLE = "Workspace";
const WORKSPACE_USER_TABLE = "Workspace_User";

class WorkspaceUserAPI extends SQLDataSource {
  async createWorkspaceUser(workspaceUser) {
    try {
      return await this._createWorkspaceUser(workspaceUser);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async readWorkspaceUsers(whereObj) {
    try {
      return await this._readWorkspaceUsers(whereObj);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async readWorkspaceUser(whereObj) {
    try {
      return await this._readWorkspaceUser(whereObj);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateWorkspaceUser(whereObj, workspaceUser) {
    try {
      return await this._updateWorkspaceUser(whereObj, workspaceUser);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async deleteWorkspaceUser(whereObj) {
    try {
      const isSuccess = await this._deleteWorkspaceUser(whereObj);
      if (isSuccess) return true;
      return false;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async _createWorkspaceUser(workspaceUser) {
    return this.db(WORKSPACE_USER_TABLE)
      .insert(workspaceUser)
      .returning("*")
      .then(([workspaceUserDetails]) => workspaceUserDetails);
  }

  async _readWorkspaceUsers(whereObj) {
    return this.knex(WORKSPACE_USER_TABLE).where(whereObj);
  }

  _readWorkspaceUser(whereObj) {
    return this.knex(WORKSPACE_USER_TABLE)
      .where(whereObj)
      .first();
  }

  async _updateWorkspaceUser(whereObj, workspaceUser) {
    return this.knex(WORKSPACE_USER_TABLE)
      .where(whereObj)
      .update(workspaceUser)
      .returning("*")
      .then(([workspaceUserDetails]) => workspaceUserDetails);
  }

  _deleteWorkspaceUser(whereObj) {
    return this.knex(WORKSPACE_USER_TABLE)
      .where(whereObj)
      .del();
  }
}

module.exports = new WorkspaceUserAPI(knexConfig);
