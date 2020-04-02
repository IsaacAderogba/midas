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
  NewProjectInput: { // input type
    inviteSharePrivileges?: NexusGenEnums['ProjectInviteSharePrivileges'] | null; // ProjectInviteSharePrivileges
    inviteShareStatus?: NexusGenEnums['ProjectInviteShareStatus'] | null; // ProjectInviteShareStatus
    thumbnailPhotoID?: string | null; // String
    thumbnailPhotoURL?: string | null; // String
    title: string; // String!
    workspaceId: string; // String!
    workspaceUserId: string; // String!
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
  ProjectInput: { // input type
    inviteSharePrivileges?: NexusGenEnums['ProjectInviteSharePrivileges'] | null; // ProjectInviteSharePrivileges
    inviteShareStatus?: NexusGenEnums['ProjectInviteShareStatus'] | null; // ProjectInviteShareStatus
    thumbnailPhotoID?: string | null; // String
    thumbnailPhotoURL?: string | null; // String
    title?: string | null; // String
    workspaceId?: string | null; // String
    workspaceUserId?: string | null; // String
  }
  ProjectWhere: { // input type
    id?: string | null; // ID
    workspaceUserId?: string | null; // ID
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
  ProjectInviteSharePrivileges: "can_view"
  ProjectInviteShareStatus: "people_invited"
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
  Project: { // root type
    createdAt: string; // String!
    id: string; // ID!
    inviteSharePrivileges: NexusGenEnums['ProjectInviteSharePrivileges']; // ProjectInviteSharePrivileges!
    inviteShareStatus: NexusGenEnums['ProjectInviteShareStatus']; // ProjectInviteShareStatus!
    thumbnailPhotoID?: string | null; // String
    thumbnailPhotoURL?: string | null; // String
    title: string; // String!
    updatedAt: string; // String!
    workspaceId: string; // ID!
    workspaceUserId: string; // ID!
  }
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
    userId: string; // ID!
    workspaceId: string; // ID!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  LoginInput: NexusGenInputs['LoginInput'];
  NewProjectInput: NexusGenInputs['NewProjectInput'];
  NewWorkspaceInput: NexusGenInputs['NewWorkspaceInput'];
  NewWorkspaceUserInput: NexusGenInputs['NewWorkspaceUserInput'];
  ProjectInput: NexusGenInputs['ProjectInput'];
  ProjectWhere: NexusGenInputs['ProjectWhere'];
  RegisterInput: NexusGenInputs['RegisterInput'];
  UserInput: NexusGenInputs['UserInput'];
  WorkspaceInput: NexusGenInputs['WorkspaceInput'];
  WorkspaceUserInput: NexusGenInputs['WorkspaceUserInput'];
  WorkspaceUserWhere: NexusGenInputs['WorkspaceUserWhere'];
  ProjectInviteSharePrivileges: NexusGenEnums['ProjectInviteSharePrivileges'];
  ProjectInviteShareStatus: NexusGenEnums['ProjectInviteShareStatus'];
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
    createProject: NexusGenRootTypes['Project'] | null; // Project
    createWorkspace: NexusGenRootTypes['Workspace'] | null; // Workspace
    createWorkspaceUser: NexusGenRootTypes['WorkspaceUser'] | null; // WorkspaceUser
    deleteProject: NexusGenRootTypes['Project'] | null; // Project
    deleteUser: boolean; // Boolean!
    deleteWorkspace: boolean; // Boolean!
    deleteWorkspaceUser: boolean; // Boolean!
    loginUser: NexusGenRootTypes['AuthUser']; // AuthUser!
    registerUser: NexusGenRootTypes['AuthUser']; // AuthUser!
    updateProject: NexusGenRootTypes['Project'] | null; // Project
    updateUser: NexusGenRootTypes['User'] | null; // User
    updateWorkspace: NexusGenRootTypes['Workspace'] | null; // Workspace
    updateWorkspaceUser: NexusGenRootTypes['WorkspaceUser'] | null; // WorkspaceUser
  }
  Project: { // field return type
    createdAt: string; // String!
    id: string; // ID!
    inviteSharePrivileges: NexusGenEnums['ProjectInviteSharePrivileges']; // ProjectInviteSharePrivileges!
    inviteShareStatus: NexusGenEnums['ProjectInviteShareStatus']; // ProjectInviteShareStatus!
    thumbnailPhotoID: string | null; // String
    thumbnailPhotoURL: string | null; // String
    title: string; // String!
    updatedAt: string; // String!
    workspace: NexusGenRootTypes['Workspace']; // Workspace!
    workspaceId: string; // ID!
    workspaceUser: NexusGenRootTypes['WorkspaceUser']; // WorkspaceUser!
    workspaceUserId: string; // ID!
  }
  Query: { // field return type
    project: NexusGenRootTypes['Project'] | null; // Project
    projects: NexusGenRootTypes['Project'][] | null; // [Project!]
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
    userId: string; // ID!
    workspace: NexusGenRootTypes['Workspace']; // Workspace!
    workspaceId: string; // ID!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createProject: { // args
      newProjectInput?: NexusGenInputs['NewProjectInput'] | null; // NewProjectInput
    }
    createWorkspace: { // args
      newWorkspaceInput?: NexusGenInputs['NewWorkspaceInput'] | null; // NewWorkspaceInput
    }
    createWorkspaceUser: { // args
      newWorkspaceUserInput?: NexusGenInputs['NewWorkspaceUserInput'] | null; // NewWorkspaceUserInput
    }
    deleteProject: { // args
      projectId: string; // ID!
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
    updateProject: { // args
      projectInput?: NexusGenInputs['ProjectInput'] | null; // ProjectInput
      where?: NexusGenInputs['ProjectWhere'] | null; // ProjectWhere
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
    project: { // args
      where?: NexusGenInputs['ProjectWhere'] | null; // ProjectWhere
    }
    workspaceUser: { // args
      where?: NexusGenInputs['WorkspaceUserWhere'] | null; // WorkspaceUserWhere
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthUser" | "Mutation" | "Project" | "Query" | "User" | "Workspace" | "WorkspaceUser";

export type NexusGenInputNames = "LoginInput" | "NewProjectInput" | "NewWorkspaceInput" | "NewWorkspaceUserInput" | "ProjectInput" | "ProjectWhere" | "RegisterInput" | "UserInput" | "WorkspaceInput" | "WorkspaceUserInput" | "WorkspaceUserWhere";

export type NexusGenEnumNames = "ProjectInviteSharePrivileges" | "ProjectInviteShareStatus" | "WorkspaceUserRoles" | "WorkspaceUserStatus";

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