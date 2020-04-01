import gql from "graphql-tag";

export const Workspace = {
  fragments: {
    attributes: gql`
      fragment workspaceAttributes on Workspace {
        id
        name
        url
        photoURL
        photoId
        trialStartedAt
        seats
      }
    `,
    workspacesAttributes: gql`
      fragment workspacesAttributes on Workspace {
        id
        name
        url
        photoURL
      }
    `
  }
};

export const User = {
  fragments: {
    attributes: gql`
      fragment userAttributes on User {
        id
        firstName
        lastName
        email
        avatarURL
        isVerified
        photoId
        workspaces {
          ...workspacesAttributes
        }
      }
      ${Workspace.fragments.workspacesAttributes}
    `
  }
};
