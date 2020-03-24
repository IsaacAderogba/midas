const { SQLDataSource } = require("datasource-sql");
const { knexConfig } = require("../../db/dbConfig");
const { ROLES } = require("../permissions");

const MINUTE = 60;
const WORKSPACE_TABLE = "Workspace";
const WORKSPACE_USER_TABLE = "Workspace_User";

class WorkspaceAPI extends SQLDataSource {
  /**
   * Creates workspace and a user for that workspace
   */
  async createWorkspaceBatch(workspace, userId) {
    try {
      const workspaceId = await this._createWorkspaceBatch(workspace, userId);
      return this._readWorkspace({ id: workspaceId });
    } catch (err) {
      console.log(err);
    }
  }

  async readWorkspace(whereObj) {
    return await this._readWorkspace(whereObj);
  }

  async updateWorkspace(whereObj, workspace) {
    await this._updateWorkspace(whereObj, workspace);
    return await this._readWorkspace(whereObj);
  }

  async deleteWorkspace(whereObj) {
    // TODO - make sure billing for workspace isn't active
    try {
      const isSuccess = await this._deleteWorkspace(whereObj);
      if (isSuccess) return true;
      return false;
    } catch (err) {
      return false;
    }
  }

  /**
   * Creates workspace and a user for that workspace
   */
  async _createWorkspaceBatch(workspace, userId) {
    return this.knex.transaction(async trx => {
      return trx
        .insert(workspace)
        .into(WORKSPACE_TABLE)
        .returning("id")
        .then(([id]) => {
          const workspaceId = id;
          const workspaceUser = {
            workspaceId,
            userId,
            role: ROLES.owner
          };
          trx(WORKSPACE_USER_TABLE)
            .insert(workspaceUser)
            .then(() => workspaceId);
        });
    });
  }

  _readWorkspace(whereObj) {
    return this.knex(WORKSPACE_TABLE)
      .where(whereObj)
      .first()
      .cache(MINUTE);
  }

  _updateWorkspace(whereObj, workspace) {
    return this.knex(WORKSPACE_TABLE)
      .where(whereObj)
      .update(workspace);
  }

  _deleteWorkspace(whereObj) {
    return this.knex(WORKSPACE_TABLE)
      .where(whereObj)
      .del();
  }
}

module.exports = new WorkspaceAPI(knexConfig);
