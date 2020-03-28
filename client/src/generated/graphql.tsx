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
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  registerUser?: Maybe<AuthUser>;
  updateUser?: Maybe<User>;
  deleteUser: Scalars['Boolean'];
  createWorkspace?: Maybe<Workspace>;
  updateWorkspace?: Maybe<Workspace>;
  deleteWorkspace: Scalars['Boolean'];
  createWorkspaceUser?: Maybe<WorkspaceUser>;
  updateWorkspaceUser?: Maybe<WorkspaceUser>;
  deleteWorkspaceUser: Scalars['Boolean'];
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
  loginUser?: Maybe<AuthUser>;
  user?: Maybe<User>;
  workspace?: Maybe<Workspace>;
  workspaces: Array<Workspace>;
  workspaceUser?: Maybe<WorkspaceUser>;
  workspaceUsers?: Maybe<Array<WorkspaceUser>>;
};


export type QueryLoginUserArgs = {
  loginInput?: Maybe<LoginInput>;
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
};

export type WorkspaceInput = {
  name?: Maybe<Scalars['String']>;
  photoURL?: Maybe<Scalars['String']>;
};

export type WorkspaceUser = {
   __typename?: 'WorkspaceUser';
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

export type GetUserQueryVariables = {};


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'avatarURL' | 'isVerified' | 'photoId'>
    & { workspaces?: Maybe<Array<(
      { __typename?: 'Workspace' }
      & Pick<Workspace, 'id' | 'name' | 'photoURL'>
    )>> }
  )> }
);


export const GetUserDocument = gql`
    query getUser {
  user {
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
}
    `;

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