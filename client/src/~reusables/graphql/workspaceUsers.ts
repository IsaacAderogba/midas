import gql from "graphql-tag";

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
