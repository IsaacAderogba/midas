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
      const workspaceId = await this._createWorkspaceBatch(
        { ...workspace, trialStartedAt: new Date().toISOString() },
        userId
      );

      return workspaceId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async readWorkspace(whereObj) {
    try {
      return await this._readWorkspace(whereObj);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateWorkspace(whereObj, workspace) {
    try {
      return await this._updateWorkspace(whereObj, workspace);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async deleteWorkspace(whereObj) {
    // TODO - make sure billing for workspace isn't active
    try {
      const isSuccess = await this._deleteWorkspace(whereObj);
      if (isSuccess) return true;
      return false;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * Creates workspace and a user for that workspace
   */
  async _createWorkspaceBatch(workspace, userId) {
    return this.knex.transaction(async trx => {
      let workspaceId;

      await trx
        .insert(workspace)
        .into(WORKSPACE_TABLE)
        .returning("id")
        .then(([id]) => {
          workspaceId = id;
          const workspaceUser = {
            workspaceId,
            userId,
            role: ROLES.owner
          };
          trx(WORKSPACE_USER_TABLE)
            .insert(workspaceUser)
            .then(() => {});
        });

      return workspaceId;
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
      .update(workspace)
      .returning("id")
      .then(([id]) => id);
  }

  _deleteWorkspace(whereObj) {
    return this.knex(WORKSPACE_TABLE)
      .where(whereObj)
      .del();
  }
}

module.exports = new WorkspaceAPI(knexConfig);
