import gql from "graphql-tag";
import { Project } from "../utils/fragments";

export const getProject = gql`
  query getProject($where: ProjectWhere!) {
    project(where: $where) {
      ...projectAttributes
    }
  }
  ${Project.fragments.attributes}
`;

export const getProjects = gql`
  query getProjects($where: ProjectWhere) {
    projects(where: $where) {
      ...projectsAttributes
    }
  }
  ${Project.fragments.projectsAttributes}
`;

export const projectsSubscription = gql`
  subscription projects {
    projects {
      mutation
      data {
        ...projectsAttributes
      }
    }
  }
  ${Project.fragments.projectsAttributes}
`;

export const updateProject = gql`
  mutation updateProject($projectInput: ProjectInput!, $where: ProjectWhere!) {
    updateProject(projectInput: $projectInput, where: $where) {
      ...projectAttributes
    }
  }
  ${Project.fragments.attributes}
`;

export const createProject = gql`
  mutation createProject($newProjectInput: NewProjectInput!) {
    createProject(newProjectInput: $newProjectInput) {
      id
      workspaceId
      workspaceUserId
      title
      thumbnailPhotoURL
      thumbnailPhotoID
      inviteShareStatus
      inviteSharePrivileges
      createdAt
      updatedAt
    }
  }
`;