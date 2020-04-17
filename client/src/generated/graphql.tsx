import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthUser = {
   __typename?: 'AuthUser';
  userId: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  avatarURL?: Maybe<Scalars['String']>;
  token: Scalars['String'];
  isVerified: Scalars['Boolean'];
  user: User;
};

export enum CanvasScene {
  SceneUpdate = 'SCENE_UPDATE',
  MouseLocation = 'MOUSE_LOCATION',
  ClientConnect = 'CLIENT_CONNECT',
  ClientDisconnect = 'CLIENT_DISCONNECT'
}

export type CollaboratorPayload = {
   __typename?: 'CollaboratorPayload';
  userId: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  avatarURL?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  canvasScene: CanvasScene;
  pointerCoordX?: Maybe<Scalars['Float']>;
  pointerCoordY?: Maybe<Scalars['Float']>;
};

export type CollaboratorPayloadInput = {
  userId: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  avatarURL?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  canvasScene: CanvasScene;
  pointerCoordX?: Maybe<Scalars['Float']>;
  pointerCoordY?: Maybe<Scalars['Float']>;
};

export type InvitedWorkspaceUser = {
   __typename?: 'InvitedWorkspaceUser';
  workspaceUserId: Scalars['String'];
  workspaceId: Scalars['String'];
  email: Scalars['String'];
  role: WorkspaceUserRoles;
};

export type InvitedWorkspaceUserInput = {
  workspaceUserId: Scalars['String'];
  workspaceId: Scalars['String'];
  email: Scalars['String'];
  role: WorkspaceUserRoles;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  loginUser: AuthUser;
  registerUser: AuthUser;
  updateUser?: Maybe<User>;
  deleteUser: Scalars['Boolean'];
  createWorkspace?: Maybe<Workspace>;
  updateWorkspace?: Maybe<Workspace>;
  deleteWorkspace: Scalars['Boolean'];
  createWorkspaceUser?: Maybe<WorkspaceUser>;
  updateWorkspaceUser?: Maybe<WorkspaceUser>;
  deleteWorkspaceUser: Scalars['Boolean'];
  createInvitedWorkspaceUser: InvitedWorkspaceUser;
  acceptWorkspaceUserInvite: AuthUser;
  createProject?: Maybe<Project>;
  updateProject?: Maybe<Project>;
  deleteProject?: Maybe<Project>;
};


export type MutationLoginUserArgs = {
  loginInput?: Maybe<LoginInput>;
};


export type MutationRegisterUserArgs = {
  registerInput?: Maybe<RegisterInput>;
};


export type MutationUpdateUserArgs = {
  userInput?: Maybe<UserInput>;
};


export type MutationCreateWorkspaceArgs = {
  newWorkspaceInput?: Maybe<NewWorkspaceInput>;
};


export type MutationUpdateWorkspaceArgs = {
  workspaceInput?: Maybe<WorkspaceInput>;
};


export type MutationCreateWorkspaceUserArgs = {
  newWorkspaceUserInput?: Maybe<NewWorkspaceUserInput>;
};


export type MutationUpdateWorkspaceUserArgs = {
  where?: Maybe<WorkspaceUserWhere>;
  workspaceUserInput?: Maybe<WorkspaceUserInput>;
};


export type MutationDeleteWorkspaceUserArgs = {
  where?: Maybe<WorkspaceUserWhere>;
};


export type MutationCreateInvitedWorkspaceUserArgs = {
  invitedWorkspaceUserInput?: Maybe<InvitedWorkspaceUserInput>;
};


export type MutationAcceptWorkspaceUserInviteArgs = {
  invitedWorkspaceUserInput?: Maybe<InvitedWorkspaceUserInput>;
  registerInput?: Maybe<RegisterInput>;
  loginInput?: Maybe<LoginInput>;
};


export type MutationCreateProjectArgs = {
  newProjectInput: NewProjectInput;
};


export type MutationUpdateProjectArgs = {
  collaboratorPayloadInput?: Maybe<CollaboratorPayloadInput>;
  projectInput?: Maybe<ProjectInput>;
  where: ProjectWhere;
};


export type MutationDeleteProjectArgs = {
  where: ProjectWhere;
};

export enum MutationType {
  Created = 'CREATED',
  Updated = 'UPDATED',
  Deleted = 'DELETED'
}

export type NewProjectInput = {
  workspaceUserId: Scalars['String'];
  title: Scalars['String'];
  thumbnailPhotoURL?: Maybe<Scalars['String']>;
  thumbnailPhotoID?: Maybe<Scalars['String']>;
  inviteShareStatus?: Maybe<ProjectInviteShareStatus>;
  inviteSharePrivileges?: Maybe<ProjectInviteSharePrivileges>;
};

export type NewWorkspaceInput = {
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  photoURL?: Maybe<Scalars['String']>;
};

export type NewWorkspaceUserInput = {
  workspaceId: Scalars['Int'];
  userId: Scalars['Int'];
  role: WorkspaceUserRoles;
};

export type Project = {
   __typename?: 'Project';
  id: Scalars['ID'];
  workspaceId: Scalars['ID'];
  workspaceUserId: Scalars['ID'];
  title: Scalars['String'];
  thumbnailPhotoURL?: Maybe<Scalars['String']>;
  thumbnailPhotoID?: Maybe<Scalars['String']>;
  inviteShareStatus: ProjectInviteShareStatus;
  inviteSharePrivileges: ProjectInviteSharePrivileges;
  elements?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  collaborators?: Maybe<Array<CollaboratorPayload>>;
  workspace: Workspace;
  workspaceUser: WorkspaceUser;
};

export type ProjectInput = {
  workspaceUserId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  thumbnailPhotoURL?: Maybe<Scalars['String']>;
  thumbnailPhotoID?: Maybe<Scalars['String']>;
  inviteShareStatus?: Maybe<ProjectInviteShareStatus>;
  inviteSharePrivileges?: Maybe<ProjectInviteSharePrivileges>;
  elements?: Maybe<Scalars['String']>;
};

export enum ProjectInviteSharePrivileges {
  CanView = 'can_view'
}

export enum ProjectInviteShareStatus {
  PeopleInvited = 'people_invited'
}

export type ProjectSubscriptionPayload = {
   __typename?: 'ProjectSubscriptionPayload';
  mutation?: Maybe<MutationType>;
  collaboratorPayload?: Maybe<CollaboratorPayload>;
  data?: Maybe<Project>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
};

export type ProjectWhere = {
  id?: Maybe<Scalars['ID']>;
  workspaceUserId?: Maybe<Scalars['ID']>;
  workspaceId?: Maybe<Scalars['ID']>;
};

export type Query = {
   __typename?: 'Query';
  user?: Maybe<User>;
  workspace?: Maybe<Workspace>;
  workspaces: Array<Workspace>;
  workspaceUser?: Maybe<WorkspaceUser>;
  workspaceUsers?: Maybe<Array<WorkspaceUser>>;
  project?: Maybe<Project>;
  projects: Array<Project>;
};


export type QueryWorkspaceUserArgs = {
  where?: Maybe<WorkspaceUserWhere>;
};


export type QueryProjectArgs = {
  where: ProjectWhere;
};


export type QueryProjectsArgs = {
  where?: Maybe<ProjectWhere>;
};

export type RegisterInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  avatarURL?: Maybe<Scalars['String']>;
};

export type Subscription = {
   __typename?: 'Subscription';
  projects: ProjectSubscriptionPayload;
  project: ProjectSubscriptionPayload;
};


export type SubscriptionProjectArgs = {
  where: ProjectWhere;
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  avatarURL?: Maybe<Scalars['String']>;
  isVerified: Scalars['Boolean'];
  photoId?: Maybe<Scalars['Boolean']>;
  workspaces?: Maybe<Array<Workspace>>;
};

export type UserInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  avatarURL?: Maybe<Scalars['String']>;
  isVerified?: Maybe<Scalars['String']>;
  photoId?: Maybe<Scalars['String']>;
};

export type Workspace = {
   __typename?: 'Workspace';
  id: Scalars['ID'];
  name: Scalars['String'];
  url: Scalars['String'];
  photoURL?: Maybe<Scalars['String']>;
  photoId?: Maybe<Scalars['String']>;
  trialStartedAt?: Maybe<Scalars['String']>;
  seats: Scalars['Int'];
  workspaceUsers: Array<WorkspaceUser>;
};

export type WorkspaceInput = {
  name?: Maybe<Scalars['String']>;
  photoURL?: Maybe<Scalars['String']>;
};

export type WorkspaceUser = {
   __typename?: 'WorkspaceUser';
  id: Scalars['ID'];
  workspaceId: Scalars['ID'];
  userId: Scalars['ID'];
  role: WorkspaceUserRoles;
  lastSeen?: Maybe<Scalars['String']>;
  status: WorkspaceUserStatus;
  user: User;
  workspace: Workspace;
};

export type WorkspaceUserInput = {
  role?: Maybe<WorkspaceUserRoles>;
  status?: Maybe<WorkspaceUserStatus>;
};

export enum WorkspaceUserRoles {
  Owner = 'owner',
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer'
}

export enum WorkspaceUserStatus {
  Active = 'active'
}

export type WorkspaceUserWhere = {
  userId?: Maybe<Scalars['ID']>;
};

export type GetProjectQueryVariables = {
  where: ProjectWhere;
};


export type GetProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & ProjectAttributesFragment
  )> }
);

export type GetProjectsQueryVariables = {
  where?: Maybe<ProjectWhere>;
};


export type GetProjectsQuery = (
  { __typename?: 'Query' }
  & { projects: Array<(
    { __typename?: 'Project' }
    & ProjectsAttributesFragment
  )> }
);

export type ProjectsSubscriptionVariables = {};


export type ProjectsSubscription = (
  { __typename?: 'Subscription' }
  & { projects: (
    { __typename?: 'ProjectSubscriptionPayload' }
    & Pick<ProjectSubscriptionPayload, 'mutation'>
    & { data?: Maybe<(
      { __typename?: 'Project' }
      & ProjectsAttributesFragment
    )> }
  ) }
);

export type ProjectSubscriptionVariables = {
  where: ProjectWhere;
};


export type ProjectSubscription = (
  { __typename?: 'Subscription' }
  & { project: (
    { __typename?: 'ProjectSubscriptionPayload' }
    & Pick<ProjectSubscriptionPayload, 'mutation'>
    & { data?: Maybe<(
      { __typename?: 'Project' }
      & Pick<Project, 'elements'>
    )>, collaboratorPayload?: Maybe<(
      { __typename?: 'CollaboratorPayload' }
      & Pick<CollaboratorPayload, 'userId' | 'firstName' | 'lastName' | 'email' | 'avatarURL' | 'color' | 'canvasScene' | 'pointerCoordX' | 'pointerCoordY'>
    )> }
  ) }
);

export type UpdateProjectMutationVariables = {
  projectInput?: Maybe<ProjectInput>;
  collaboratorPayloadInput?: Maybe<CollaboratorPayloadInput>;
  where: ProjectWhere;
};


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject?: Maybe<(
    { __typename?: 'Project' }
    & ProjectAttributesFragment
  )> }
);

export type CreateProjectMutationVariables = {
  newProjectInput: NewProjectInput;
};


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'workspaceId' | 'workspaceUserId' | 'title' | 'thumbnailPhotoURL' | 'thumbnailPhotoID' | 'inviteShareStatus' | 'inviteSharePrivileges' | 'createdAt' | 'updatedAt'>
  )> }
);

export type GetUserQueryVariables = {};


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserAttributesFragment
  )> }
);

export type LoginUserMutationVariables = {
  loginInput?: Maybe<LoginInput>;
};


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { loginUser: (
    { __typename?: 'AuthUser' }
    & Pick<AuthUser, 'token'>
    & { user: (
      { __typename?: 'User' }
      & UserAttributesFragment
    ) }
  ) }
);

export type RegisterUserMutationVariables = {
  registerInput?: Maybe<RegisterInput>;
};


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'AuthUser' }
    & Pick<AuthUser, 'token'>
    & { user: (
      { __typename?: 'User' }
      & UserAttributesFragment
    ) }
  ) }
);

export type CreateWorkspaceMutationVariables = {
  newWorkspaceInput?: Maybe<NewWorkspaceInput>;
};


export type CreateWorkspaceMutation = (
  { __typename?: 'Mutation' }
  & { createWorkspace?: Maybe<(
    { __typename?: 'Workspace' }
    & WorkspaceAttributesFragment
  )> }
);

export type GetWorkspaceQueryVariables = {
  where: WorkspaceUserWhere;
};


export type GetWorkspaceQuery = (
  { __typename?: 'Query' }
  & { workspace?: Maybe<(
    { __typename?: 'Workspace' }
    & { workspaceUsers: Array<(
      { __typename?: 'WorkspaceUser' }
      & Pick<WorkspaceUser, 'role'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarURL' | 'email'>
      ) }
    )> }
    & WorkspaceAttributesFragment
  )>, workspaceUser?: Maybe<(
    { __typename?: 'WorkspaceUser' }
    & Pick<WorkspaceUser, 'id' | 'workspaceId' | 'userId' | 'role' | 'lastSeen' | 'status'>
  )> }
);

export type GetWorkspacesQueryVariables = {};


export type GetWorkspacesQuery = (
  { __typename?: 'Query' }
  & { workspaces: Array<(
    { __typename?: 'Workspace' }
    & WorkspacesAttributesFragment
  )> }
);

export type WorkspaceUsersQueryVariables = {};


export type WorkspaceUsersQuery = (
  { __typename?: 'Query' }
  & { workspaceUsers?: Maybe<Array<(
    { __typename?: 'WorkspaceUser' }
    & Pick<WorkspaceUser, 'role'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'firstName' | 'lastName' | 'email' | 'avatarURL'>
    ) }
  )>> }
);

export type CreateInvitedWorkspaceUserMutationVariables = {
  invitedWorkspaceUserInput?: Maybe<InvitedWorkspaceUserInput>;
};


export type CreateInvitedWorkspaceUserMutation = (
  { __typename?: 'Mutation' }
  & { createInvitedWorkspaceUser: (
    { __typename?: 'InvitedWorkspaceUser' }
    & Pick<InvitedWorkspaceUser, 'workspaceUserId' | 'workspaceId' | 'email' | 'role'>
  ) }
);

export type AcceptWorkspaceUserInviteMutationVariables = {
  invitedWorkspaceUserInput: InvitedWorkspaceUserInput;
  registerInput?: Maybe<RegisterInput>;
  loginInput?: Maybe<LoginInput>;
};


export type AcceptWorkspaceUserInviteMutation = (
  { __typename?: 'Mutation' }
  & { acceptWorkspaceUserInvite: (
    { __typename?: 'AuthUser' }
    & Pick<AuthUser, 'token'>
    & { user: (
      { __typename?: 'User' }
      & UserAttributesFragment
    ) }
  ) }
);

export type WorkspaceAttributesFragment = (
  { __typename?: 'Workspace' }
  & Pick<Workspace, 'id' | 'name' | 'url' | 'photoURL' | 'photoId' | 'trialStartedAt' | 'seats'>
);

export type WorkspacesAttributesFragment = (
  { __typename?: 'Workspace' }
  & Pick<Workspace, 'id' | 'name' | 'url' | 'photoURL'>
);

export type UserAttributesFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'avatarURL' | 'isVerified' | 'photoId'>
  & { workspaces?: Maybe<Array<(
    { __typename?: 'Workspace' }
    & WorkspacesAttributesFragment
  )>> }
);

export type ProjectAttributesFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'workspaceId' | 'workspaceUserId' | 'title' | 'thumbnailPhotoURL' | 'thumbnailPhotoID' | 'inviteShareStatus' | 'inviteSharePrivileges' | 'elements' | 'createdAt' | 'updatedAt'>
  & { collaborators?: Maybe<Array<(
    { __typename?: 'CollaboratorPayload' }
    & Pick<CollaboratorPayload, 'userId' | 'firstName' | 'lastName' | 'email' | 'avatarURL' | 'color' | 'pointerCoordX' | 'pointerCoordY'>
  )>> }
);

export type ProjectsAttributesFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'workspaceId' | 'workspaceUserId' | 'title' | 'thumbnailPhotoURL' | 'thumbnailPhotoID' | 'inviteShareStatus' | 'inviteSharePrivileges' | 'createdAt' | 'updatedAt'>
);

export const WorkspaceAttributesFragmentDoc = gql`
    fragment workspaceAttributes on Workspace {
  id
  name
  url
  photoURL
  photoId
  trialStartedAt
  seats
}
    `;
export const WorkspacesAttributesFragmentDoc = gql`
    fragment workspacesAttributes on Workspace {
  id
  name
  url
  photoURL
}
    `;
export const UserAttributesFragmentDoc = gql`
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
    ${WorkspacesAttributesFragmentDoc}`;
export const ProjectAttributesFragmentDoc = gql`
    fragment projectAttributes on Project {
  id
  workspaceId
  workspaceUserId
  title
  thumbnailPhotoURL
  thumbnailPhotoID
  inviteShareStatus
  inviteSharePrivileges
  elements
  collaborators {
    userId
    firstName
    lastName
    email
    avatarURL
    color
    pointerCoordX
    pointerCoordY
  }
  createdAt
  updatedAt
}
    `;
export const ProjectsAttributesFragmentDoc = gql`
    fragment projectsAttributes on Project {
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
    `;
export const GetProjectDocument = gql`
    query getProject($where: ProjectWhere!) {
  project(where: $where) {
    ...projectAttributes
  }
}
    ${ProjectAttributesFragmentDoc}`;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetProjectQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, baseOptions);
      }
export function useGetProjectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, baseOptions);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectQueryResult = ApolloReactCommon.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetProjectsDocument = gql`
    query getProjects($where: ProjectWhere) {
  projects(where: $where) {
    ...projectsAttributes
  }
}
    ${ProjectsAttributesFragmentDoc}`;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetProjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
      }
export function useGetProjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = ApolloReactCommon.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const ProjectsDocument = gql`
    subscription projects {
  projects {
    mutation
    data {
      ...projectsAttributes
    }
  }
}
    ${ProjectsAttributesFragmentDoc}`;

/**
 * __useProjectsSubscription__
 *
 * To run a query within a React component, call `useProjectsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useProjectsSubscription` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useProjectsSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<ProjectsSubscription, ProjectsSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<ProjectsSubscription, ProjectsSubscriptionVariables>(ProjectsDocument, baseOptions);
      }
export type ProjectsSubscriptionHookResult = ReturnType<typeof useProjectsSubscription>;
export type ProjectsSubscriptionResult = ApolloReactCommon.SubscriptionResult<ProjectsSubscription>;
export const ProjectDocument = gql`
    subscription project($where: ProjectWhere!) {
  project(where: $where) {
    data {
      elements
    }
    mutation
    collaboratorPayload {
      userId
      firstName
      lastName
      email
      avatarURL
      color
      canvasScene
      pointerCoordX
      pointerCoordY
    }
  }
}
    `;

/**
 * __useProjectSubscription__
 *
 * To run a query within a React component, call `useProjectSubscription` and pass it any options that fit your needs.
 * When your component renders, `useProjectSubscription` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectSubscription({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useProjectSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<ProjectSubscription, ProjectSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<ProjectSubscription, ProjectSubscriptionVariables>(ProjectDocument, baseOptions);
      }
export type ProjectSubscriptionHookResult = ReturnType<typeof useProjectSubscription>;
export type ProjectSubscriptionResult = ApolloReactCommon.SubscriptionResult<ProjectSubscription>;
export const UpdateProjectDocument = gql`
    mutation updateProject($projectInput: ProjectInput, $collaboratorPayloadInput: CollaboratorPayloadInput, $where: ProjectWhere!) {
  updateProject(projectInput: $projectInput, collaboratorPayloadInput: $collaboratorPayloadInput, where: $where) {
    ...projectAttributes
  }
}
    ${ProjectAttributesFragmentDoc}`;
export type UpdateProjectMutationFn = ApolloReactCommon.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      projectInput: // value for 'projectInput'
 *      collaboratorPayloadInput: // value for 'collaboratorPayloadInput'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, baseOptions);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = ApolloReactCommon.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const CreateProjectDocument = gql`
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
export type CreateProjectMutationFn = ApolloReactCommon.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      newProjectInput: // value for 'newProjectInput'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = ApolloReactCommon.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const GetUserDocument = gql`
    query getUser {
  user {
    ...userAttributes
  }
}
    ${UserAttributesFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        return ApolloReactHooks.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
      }
export function useGetUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = ApolloReactCommon.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const LoginUserDocument = gql`
    mutation loginUser($loginInput: LoginInput) {
  loginUser(loginInput: $loginInput) {
    token
    user {
      ...userAttributes
    }
  }
}
    ${UserAttributesFragmentDoc}`;
export type LoginUserMutationFn = ApolloReactCommon.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, baseOptions);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = ApolloReactCommon.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const RegisterUserDocument = gql`
    mutation registerUser($registerInput: RegisterInput) {
  registerUser(registerInput: $registerInput) {
    token
    user {
      ...userAttributes
    }
  }
}
    ${UserAttributesFragmentDoc}`;
export type RegisterUserMutationFn = ApolloReactCommon.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, baseOptions);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = ApolloReactCommon.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const CreateWorkspaceDocument = gql`
    mutation createWorkspace($newWorkspaceInput: NewWorkspaceInput) {
  createWorkspace(newWorkspaceInput: $newWorkspaceInput) {
    ...workspaceAttributes
  }
}
    ${WorkspaceAttributesFragmentDoc}`;
export type CreateWorkspaceMutationFn = ApolloReactCommon.MutationFunction<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;

/**
 * __useCreateWorkspaceMutation__
 *
 * To run a mutation, you first call `useCreateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkspaceMutation, { data, loading, error }] = useCreateWorkspaceMutation({
 *   variables: {
 *      newWorkspaceInput: // value for 'newWorkspaceInput'
 *   },
 * });
 */
export function useCreateWorkspaceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>(CreateWorkspaceDocument, baseOptions);
      }
export type CreateWorkspaceMutationHookResult = ReturnType<typeof useCreateWorkspaceMutation>;
export type CreateWorkspaceMutationResult = ApolloReactCommon.MutationResult<CreateWorkspaceMutation>;
export type CreateWorkspaceMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const GetWorkspaceDocument = gql`
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
    ${WorkspaceAttributesFragmentDoc}`;

/**
 * __useGetWorkspaceQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetWorkspaceQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetWorkspaceQuery, GetWorkspaceQueryVariables>) {
        return ApolloReactHooks.useQuery<GetWorkspaceQuery, GetWorkspaceQueryVariables>(GetWorkspaceDocument, baseOptions);
      }
export function useGetWorkspaceLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetWorkspaceQuery, GetWorkspaceQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetWorkspaceQuery, GetWorkspaceQueryVariables>(GetWorkspaceDocument, baseOptions);
        }
export type GetWorkspaceQueryHookResult = ReturnType<typeof useGetWorkspaceQuery>;
export type GetWorkspaceLazyQueryHookResult = ReturnType<typeof useGetWorkspaceLazyQuery>;
export type GetWorkspaceQueryResult = ApolloReactCommon.QueryResult<GetWorkspaceQuery, GetWorkspaceQueryVariables>;
export const GetWorkspacesDocument = gql`
    query getWorkspaces {
  workspaces {
    ...workspacesAttributes
  }
}
    ${WorkspacesAttributesFragmentDoc}`;

/**
 * __useGetWorkspacesQuery__
 *
 * To run a query within a React component, call `useGetWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetWorkspacesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetWorkspacesQuery, GetWorkspacesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetWorkspacesQuery, GetWorkspacesQueryVariables>(GetWorkspacesDocument, baseOptions);
      }
export function useGetWorkspacesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetWorkspacesQuery, GetWorkspacesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetWorkspacesQuery, GetWorkspacesQueryVariables>(GetWorkspacesDocument, baseOptions);
        }
export type GetWorkspacesQueryHookResult = ReturnType<typeof useGetWorkspacesQuery>;
export type GetWorkspacesLazyQueryHookResult = ReturnType<typeof useGetWorkspacesLazyQuery>;
export type GetWorkspacesQueryResult = ApolloReactCommon.QueryResult<GetWorkspacesQuery, GetWorkspacesQueryVariables>;
export const WorkspaceUsersDocument = gql`
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

/**
 * __useWorkspaceUsersQuery__
 *
 * To run a query within a React component, call `useWorkspaceUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useWorkspaceUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>) {
        return ApolloReactHooks.useQuery<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>(WorkspaceUsersDocument, baseOptions);
      }
export function useWorkspaceUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>(WorkspaceUsersDocument, baseOptions);
        }
export type WorkspaceUsersQueryHookResult = ReturnType<typeof useWorkspaceUsersQuery>;
export type WorkspaceUsersLazyQueryHookResult = ReturnType<typeof useWorkspaceUsersLazyQuery>;
export type WorkspaceUsersQueryResult = ApolloReactCommon.QueryResult<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>;
export const CreateInvitedWorkspaceUserDocument = gql`
    mutation createInvitedWorkspaceUser($invitedWorkspaceUserInput: InvitedWorkspaceUserInput) {
  createInvitedWorkspaceUser(invitedWorkspaceUserInput: $invitedWorkspaceUserInput) {
    workspaceUserId
    workspaceId
    email
    role
  }
}
    `;
export type CreateInvitedWorkspaceUserMutationFn = ApolloReactCommon.MutationFunction<CreateInvitedWorkspaceUserMutation, CreateInvitedWorkspaceUserMutationVariables>;

/**
 * __useCreateInvitedWorkspaceUserMutation__
 *
 * To run a mutation, you first call `useCreateInvitedWorkspaceUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvitedWorkspaceUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvitedWorkspaceUserMutation, { data, loading, error }] = useCreateInvitedWorkspaceUserMutation({
 *   variables: {
 *      invitedWorkspaceUserInput: // value for 'invitedWorkspaceUserInput'
 *   },
 * });
 */
export function useCreateInvitedWorkspaceUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateInvitedWorkspaceUserMutation, CreateInvitedWorkspaceUserMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateInvitedWorkspaceUserMutation, CreateInvitedWorkspaceUserMutationVariables>(CreateInvitedWorkspaceUserDocument, baseOptions);
      }
export type CreateInvitedWorkspaceUserMutationHookResult = ReturnType<typeof useCreateInvitedWorkspaceUserMutation>;
export type CreateInvitedWorkspaceUserMutationResult = ApolloReactCommon.MutationResult<CreateInvitedWorkspaceUserMutation>;
export type CreateInvitedWorkspaceUserMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateInvitedWorkspaceUserMutation, CreateInvitedWorkspaceUserMutationVariables>;
export const AcceptWorkspaceUserInviteDocument = gql`
    mutation acceptWorkspaceUserInvite($invitedWorkspaceUserInput: InvitedWorkspaceUserInput!, $registerInput: RegisterInput, $loginInput: LoginInput) {
  acceptWorkspaceUserInvite(invitedWorkspaceUserInput: $invitedWorkspaceUserInput, registerInput: $registerInput, loginInput: $loginInput) {
    token
    user {
      ...userAttributes
    }
  }
}
    ${UserAttributesFragmentDoc}`;
export type AcceptWorkspaceUserInviteMutationFn = ApolloReactCommon.MutationFunction<AcceptWorkspaceUserInviteMutation, AcceptWorkspaceUserInviteMutationVariables>;

/**
 * __useAcceptWorkspaceUserInviteMutation__
 *
 * To run a mutation, you first call `useAcceptWorkspaceUserInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptWorkspaceUserInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptWorkspaceUserInviteMutation, { data, loading, error }] = useAcceptWorkspaceUserInviteMutation({
 *   variables: {
 *      invitedWorkspaceUserInput: // value for 'invitedWorkspaceUserInput'
 *      registerInput: // value for 'registerInput'
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useAcceptWorkspaceUserInviteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AcceptWorkspaceUserInviteMutation, AcceptWorkspaceUserInviteMutationVariables>) {
        return ApolloReactHooks.useMutation<AcceptWorkspaceUserInviteMutation, AcceptWorkspaceUserInviteMutationVariables>(AcceptWorkspaceUserInviteDocument, baseOptions);
      }
export type AcceptWorkspaceUserInviteMutationHookResult = ReturnType<typeof useAcceptWorkspaceUserInviteMutation>;
export type AcceptWorkspaceUserInviteMutationResult = ApolloReactCommon.MutationResult<AcceptWorkspaceUserInviteMutation>;
export type AcceptWorkspaceUserInviteMutationOptions = ApolloReactCommon.BaseMutationOptions<AcceptWorkspaceUserInviteMutation, AcceptWorkspaceUserInviteMutationVariables>;