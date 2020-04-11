import gql from "graphql-tag";
import { User } from "../utils/fragments";

export const getUser = gql`
  query getUser {
    user {
      ...userAttributes
    }
  }
  ${User.fragments.attributes}
`;

export const loginUser = gql`
  mutation loginUser($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      token
      user {
        ...userAttributes
      }
    }
  }
  ${User.fragments.attributes}
`;

export const registerUser = gql`
  mutation registerUser($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      token
      user {
        ...userAttributes
      }
    }
  }
  ${User.fragments.attributes}
`;