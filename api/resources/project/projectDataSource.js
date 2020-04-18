const { SQLDataSource } = require("datasource-sql");
const { knexConfig } = require("../../../db/dbConfig");
const { cloudinaryDataURLUpload } = require("../utils");
const { v4 } = require("uuid");

const PROJECT_TABLE = "Project";

class ProjectAPI extends SQLDataSource {
  async createProject(project) {
    try {
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
      if (project.dataURL) {
        const fetchedProject = await this.readProject(whereObj);
        const public_id = fetchedProject.thumbnailPhotoID
          ? fetchedProject.thumbnailPhotoID
          : v4();

        const image = await cloudinaryDataURLUpload({
          dataURL: project.dataURL,
          public_id,
        });
        project.thumbnailPhotoID = image.public_id;
        project.thumbnailPhotoURL = image.secure_url;
      }
      delete project.dataURL;

      return this._updateProject(whereObj, {
        ...project,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async deleteProject(whereObj) {
    try {
      const deletedProject = await this._readProject(whereObj);
      const isSuccess = await this._deleteProject(whereObj);

      if (!isSuccess) throw new Error("Project doesn't exist");

      return deletedProject;
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
    return this.knex(PROJECT_TABLE)
      .where(whereObj)
      .orderBy("updatedAt", "desc");
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
