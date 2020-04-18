const { SQLDataSource } = require("datasource-sql");
const { knexConfig } = require("../../../db/dbConfig");
const { ROLES } = require("../permissions");
const { cloudinaryStreamUpload } = require("../utils");
const { v4 } = require("uuid");

const WORKSPACE_TABLE = "Workspace";
const WORKSPACE_USER_TABLE = "Workspace_User";

class WorkspaceAPI extends SQLDataSource {
  /**
   * Creates workspace and a user for that workspace
   */
  async createWorkspaceBatch(workspace, userId) {
    try {
      return this._createWorkspaceBatch(
        { ...workspace, trialStartedAt: new Date().toISOString() },
        userId
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async readWorkspace(whereObj) {
    try {
      return this._readWorkspace(whereObj);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async readWorkspaces(whereObj) {
    try {
      return this._readWorkspaces(whereObj);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateWorkspace(whereObj, workspace) {
    try {
      if (workspace.file) {
        const fetchedWorkspace = await this.readWorkspace(whereObj);
        const public_id = fetchedWorkspace.photoId
          ? fetchedWorkspace.photoId
          : v4();

        const { createReadStream } = await workspace.file;
        
        const stream = createReadStream();
        const image = await cloudinaryStreamUpload({ stream, public_id });
        workspace.photoId = image.public_id;
        workspace.photoURL = image.secure_url;
        delete workspace.file;
      }
      return this._updateWorkspace(whereObj, workspace);
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
    return this.knex.transaction(async (trx) => {
      let workspaceToReturn;

      await trx
        .insert(workspace)
        .into(WORKSPACE_TABLE)
        .returning("*")
        .then(([workspace]) => {
          workspaceToReturn = workspace;
          const workspaceUser = {
            workspaceId: workspace.id,
            userId,
            role: ROLES.owner,
          };
          trx(WORKSPACE_USER_TABLE)
            .insert(workspaceUser)
            .then(() => {});
        });

      return workspaceToReturn;
    });
  }

  _readWorkspaces(whereObj) {
    return this.knex(WORKSPACE_TABLE)
      .join(
        WORKSPACE_USER_TABLE,
        `${WORKSPACE_TABLE}.id`,
        `${WORKSPACE_USER_TABLE}.workspaceId`
      )
      .select(
        `${WORKSPACE_TABLE}.id`,
        "name",
        "url",
        "photoURL",
        "photoId",
        "trialStartedAt",
        "seats"
      )
      .where(whereObj);
  }

  _readWorkspace(whereObj) {
    return this.knex(WORKSPACE_TABLE).where(whereObj).first();
  }

  _updateWorkspace(whereObj, workspace) {
    return this.knex(WORKSPACE_TABLE)
      .where(whereObj)
      .update(workspace)
      .returning("*")
      .then(([workspace]) => workspace);
  }

  _deleteWorkspace(whereObj) {
    return this.knex(WORKSPACE_TABLE).where(whereObj).del();
  }
}

module.exports = new WorkspaceAPI(knexConfig);
