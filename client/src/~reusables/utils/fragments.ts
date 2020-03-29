import gql from "graphql-tag";

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
          id
          name
          photoURL
        }
      }
    `
  }
};
