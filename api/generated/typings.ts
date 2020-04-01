/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */







declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  LoginInput: { // input type
    email: string; // String!
    password: string; // String!
  }
  NewWorkspaceInput: { // input type
    name?: string | null; // String
    photoURL?: string | null; // String
    url?: string | null; // String
  }
  NewWorkspaceUserInput: { // input type
    role: NexusGenEnums['WorkspaceUserRoles']; // WorkspaceUserRoles!
    userId: number; // Int!
    workspaceId: number; // Int!
  }
  RegisterInput: { // input type
    avatarURL?: string | null; // String
    email: string; // String!
    firstName: string; // String!
    lastName: string; // String!
    password: string; // String!
  }
  UserInput: { // input type
    avatarURL?: string | null; // String
    firstName?: string | null; // String
    isVerified?: string | null; // String
    lastName?: string | null; // String
    photoId?: string | null; // String
  }
  WorkspaceInput: { // input type
    name?: string | null; // String
    photoURL?: string | null; // String
  }
  WorkspaceUserInput: { // input type
    role?: NexusGenEnums['WorkspaceUserRoles'] | null; // WorkspaceUserRoles
    status?: NexusGenEnums['WorkspaceUserStatus'] | null; // WorkspaceUserStatus
  }
  WorkspaceUserWhere: { // input type
    userId?: number | null; // Int
  }
}

export interface NexusGenEnums {
  WorkspaceUserRoles: "admin" | "editor" | "owner" | "viewer"
  WorkspaceUserStatus: "active"
}

export interface NexusGenRootTypes {
  AuthUser: { // root type
    avatarURL?: string | null; // String
    firstName: string; // String!
    isVerified: boolean; // Boolean!
    lastName: string; // String!
    token: string; // String!
    userId: string; // ID!
  }
  Mutation: {};
  Query: {};
  User: { // root type
    avatarURL?: string | null; // String
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    isVerified: boolean; // Boolean!
    lastName: string; // String!
    photoId?: boolean | null; // Boolean
  }
  Workspace: { // root type
    id: string; // ID!
    name: string; // String!
    photoId?: string | null; // String
    photoURL?: string | null; // String
    seats: number; // Int!
    trialStartedAt?: string | null; // String
    url: string; // String!
  }
  WorkspaceUser: { // root type
    id: string; // ID!
    lastSeen?: string | null; // String
    role: NexusGenEnums['WorkspaceUserRoles']; // WorkspaceUserRoles!
    status: NexusGenEnums['WorkspaceUserStatus']; // WorkspaceUserStatus!
    userId: number; // Int!
    workspaceId: number; // Int!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  LoginInput: NexusGenInputs['LoginInput'];
  NewWorkspaceInput: NexusGenInputs['NewWorkspaceInput'];
  NewWorkspaceUserInput: NexusGenInputs['NewWorkspaceUserInput'];
  RegisterInput: NexusGenInputs['RegisterInput'];
  UserInput: NexusGenInputs['UserInput'];
  WorkspaceInput: NexusGenInputs['WorkspaceInput'];
  WorkspaceUserInput: NexusGenInputs['WorkspaceUserInput'];
  WorkspaceUserWhere: NexusGenInputs['WorkspaceUserWhere'];
  WorkspaceUserRoles: NexusGenEnums['WorkspaceUserRoles'];
  WorkspaceUserStatus: NexusGenEnums['WorkspaceUserStatus'];
}

export interface NexusGenFieldTypes {
  AuthUser: { // field return type
    avatarURL: string | null; // String
    firstName: string; // String!
    isVerified: boolean; // Boolean!
    lastName: string; // String!
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
    userId: string; // ID!
  }
  Mutation: { // field return type
    createWorkspace: NexusGenRootTypes['Workspace'] | null; // Workspace
    createWorkspaceUser: NexusGenRootTypes['WorkspaceUser'] | null; // WorkspaceUser
    deleteUser: boolean; // Boolean!
    deleteWorkspace: boolean; // Boolean!
    deleteWorkspaceUser: boolean; // Boolean!
    loginUser: NexusGenRootTypes['AuthUser']; // AuthUser!
    registerUser: NexusGenRootTypes['AuthUser']; // AuthUser!
    updateUser: NexusGenRootTypes['User'] | null; // User
    updateWorkspace: NexusGenRootTypes['Workspace'] | null; // Workspace
    updateWorkspaceUser: NexusGenRootTypes['WorkspaceUser'] | null; // WorkspaceUser
  }
  Query: { // field return type
    user: NexusGenRootTypes['User'] | null; // User
    workspace: NexusGenRootTypes['Workspace'] | null; // Workspace
    workspaces: NexusGenRootTypes['Workspace'][]; // [Workspace!]!
    workspaceUser: NexusGenRootTypes['WorkspaceUser'] | null; // WorkspaceUser
    workspaceUsers: NexusGenRootTypes['WorkspaceUser'][] | null; // [WorkspaceUser!]
  }
  User: { // field return type
    avatarURL: string | null; // String
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    isVerified: boolean; // Boolean!
    lastName: string; // String!
    photoId: boolean | null; // Boolean
    workspaces: NexusGenRootTypes['Workspace'][] | null; // [Workspace!]
  }
  Workspace: { // field return type
    id: string; // ID!
    name: string; // String!
    photoId: string | null; // String
    photoURL: string | null; // String
    seats: number; // Int!
    trialStartedAt: string | null; // String
    url: string; // String!
    workspaceUsers: NexusGenRootTypes['WorkspaceUser'][]; // [WorkspaceUser!]!
  }
  WorkspaceUser: { // field return type
    id: string; // ID!
    lastSeen: string | null; // String
    role: NexusGenEnums['WorkspaceUserRoles']; // WorkspaceUserRoles!
    status: NexusGenEnums['WorkspaceUserStatus']; // WorkspaceUserStatus!
    user: NexusGenRootTypes['User']; // User!
    userId: number; // Int!
    workspace: NexusGenRootTypes['Workspace']; // Workspace!
    workspaceId: number; // Int!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createWorkspace: { // args
      newWorkspaceInput?: NexusGenInputs['NewWorkspaceInput'] | null; // NewWorkspaceInput
    }
    createWorkspaceUser: { // args
      newWorkspaceUserInput?: NexusGenInputs['NewWorkspaceUserInput'] | null; // NewWorkspaceUserInput
    }
    deleteWorkspaceUser: { // args
      where?: NexusGenInputs['WorkspaceUserWhere'] | null; // WorkspaceUserWhere
    }
    loginUser: { // args
      loginInput?: NexusGenInputs['LoginInput'] | null; // LoginInput
    }
    registerUser: { // args
      registerInput?: NexusGenInputs['RegisterInput'] | null; // RegisterInput
    }
    updateUser: { // args
      userInput?: NexusGenInputs['UserInput'] | null; // UserInput
    }
    updateWorkspace: { // args
      workspaceInput?: NexusGenInputs['WorkspaceInput'] | null; // WorkspaceInput
    }
    updateWorkspaceUser: { // args
      where?: NexusGenInputs['WorkspaceUserWhere'] | null; // WorkspaceUserWhere
      workspaceUserInput?: NexusGenInputs['WorkspaceUserInput'] | null; // WorkspaceUserInput
    }
  }
  Query: {
    workspaceUser: { // args
      where?: NexusGenInputs['WorkspaceUserWhere'] | null; // WorkspaceUserWhere
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthUser" | "Mutation" | "Query" | "User" | "Workspace" | "WorkspaceUser";

export type NexusGenInputNames = "LoginInput" | "NewWorkspaceInput" | "NewWorkspaceUserInput" | "RegisterInput" | "UserInput" | "WorkspaceInput" | "WorkspaceUserInput" | "WorkspaceUserWhere";

export type NexusGenEnumNames = "WorkspaceUserRoles" | "WorkspaceUserStatus";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}