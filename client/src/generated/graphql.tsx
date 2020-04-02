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

export type Query = {
   __typename?: 'Query';
  user?: Maybe<User>;
  workspace?: Maybe<Workspace>;
  workspaces: Array<Workspace>;
  workspaceUser?: Maybe<WorkspaceUser>;
  workspaceUsers?: Maybe<Array<WorkspaceUser>>;
};


export type QueryWorkspaceUserArgs = {
  where?: Maybe<WorkspaceUserWhere>;
};

export type RegisterInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  avatarURL?: Maybe<Scalars['String']>;
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
  workspaceId: Scalars['Int'];
  userId: Scalars['Int'];
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
  userId?: Maybe<Scalars['Int']>;
};

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

export type GetWorkspaceQueryVariables = {};


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

export type GetUserQueryVariables = {};


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserAttributesFragment
  )> }
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
    query getWorkspace {
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