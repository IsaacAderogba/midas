const { SQLDataSource } = require("datasource-sql");
const { knexConfig } = require("../../db/dbConfig");

const PROJECT_TABLE = "Project";

class ProjectAPI extends SQLDataSource {
  async createProject(project) {
    try {
      // TODO - update what's passed in with an updated at and created at
      return this._createProject({
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async readProject(whereObj) {
    try {
      return this._readProject(whereObj);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async readProjects(whereObj) {
    try {
      return this._readProjects(whereObj);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateProject(whereObj, project) {
    try {
      // TODO - update what's passed in with an updated at and created at
      return this._updateProject(whereObj, {
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async deleteProject(whereObj) {
    try {
      const isSuccess = await this._deleteProject(whereObj);
      if (isSuccess) return true;
      return false;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async _createProject(project) {
    return this.db(PROJECT_TABLE)
      .insert(project)
      .returning("*")
      .then(([project]) => project);
  }

  _readProjects(whereObj) {
    return this.knex(PROJECT_TABLE).where(whereObj);
  }

  _readProject(whereObj) {
    return this.knex(PROJECT_TABLE).where(whereObj).first();
  }

  async _updateProject(whereObj, project) {
    return this.knex(PROJECT_TABLE)
      .where(whereObj)
      .update(project)
      .returning("*")
      .then(([project]) => project);
  }

  _deleteProject(whereObj) {
    return this.knex(PROJECT_TABLE).where(whereObj).del();
  }
}

module.exports = new ProjectAPI(knexConfig);
