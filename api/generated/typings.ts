/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */







declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  UserInput: { // input type
    avatarURL?: string | null; // String
    email: string; // String!
    firstName: string; // String!
    lastName: string; // String!
    password: string; // String!
  }
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  AuthUser: { // root type
    avatarURL?: string | null; // String
    firstName: string; // String!
    lastName: string; // String!
    token: string; // String!
    userId: string; // ID!
  }
  Mutation: {};
  Query: {};
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  UserInput: NexusGenInputs['UserInput'];
}

export interface NexusGenFieldTypes {
  AuthUser: { // field return type
    avatarURL: string | null; // String
    firstName: string; // String!
    lastName: string; // String!
    token: string; // String!
    userId: string; // ID!
  }
  Mutation: { // field return type
    registerUser: NexusGenRootTypes['AuthUser'] | null; // AuthUser
  }
  Query: { // field return type
    helloWorld: string; // String!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    registerUser: { // args
      userInput?: NexusGenInputs['UserInput'] | null; // UserInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "AuthUser" | "Mutation" | "Query";

export type NexusGenInputNames = "UserInput";

export type NexusGenEnumNames = never;

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