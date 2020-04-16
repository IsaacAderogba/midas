import gql from "graphql-tag";
import { User } from "../utils/fragments";

export const workspaceUsers = gql`
  query workspaceUsers {
    workspaceUsers {
      role
      user {
        firstName
        lastName
        email
        avatarURL
      }
    }
  }
`;

export const createInvitedWorkspaceUser = gql`
  mutation createInvitedWorkspaceUser(
    $invitedWorkspaceUserInput: InvitedWorkspaceUserInput
  ) {
    createInvitedWorkspaceUser(
      invitedWorkspaceUserInput: $invitedWorkspaceUserInput
    ) {
      workspaceUserId
      workspaceId
      email
      role
    }
  }
`;

export const acceptWorkspaceUserInvite = gql`
  mutation acceptWorkspaceUserInvite(
    $invitedWorkspaceUserInput: InvitedWorkspaceUserInput!
    $registerInput: RegisterInput
    $loginInput: LoginInput
  ) {
    acceptWorkspaceUserInvite(
      invitedWorkspaceUserInput: $invitedWorkspaceUserInput
      registerInput: $registerInput
      loginInput: $loginInput
    ) {
      token
      user {
        ...userAttributes
      }
    }
  }
  ${User.fragments.attributes}
`;
