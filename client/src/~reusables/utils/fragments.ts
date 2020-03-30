import gql from "graphql-tag";

export const Workspace = {
  fragments: {
    attributes: gql`
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
      ${Workspace.fragments.attributes}
    `
  }
};
