import gql from "graphql-tag";
import { Workspace } from "../utils/fragments";

export const createWorkspace = gql`
  mutation createWorkspace($newWorkspaceInput: NewWorkspaceInput) {
    createWorkspace(newWorkspaceInput: $newWorkspaceInput) {
      ...workspaceAttributes
    }
  }
  ${Workspace.fragments.attributes}
`;

export const getWorkspace = gql`
  query getWorkspace($where: WorkspaceUserWhere!) {
    workspace {
      ...workspaceAttributes
      workspaceUsers {
        role
        user {
          id
          firstName
          lastName
          avatarURL
          email
        }
      }
    }
    workspaceUser(where: $where) {
      id
      workspaceId
      userId
      role
      lastSeen
      status
    }
  }
  ${Workspace.fragments.attributes}
`;

export const getWorkspaces = gql`
  query getWorkspaces {
    workspaces {
      ...workspacesAttributes
    }
  }
  ${Workspace.fragments.workspacesAttributes}
`;
