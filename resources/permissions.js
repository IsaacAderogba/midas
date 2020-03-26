const { rule } = require("graphql-shield");

const ROLES = {
  owner: "owner",
  admin: "admin",
  editor: "editor",
  viewer: "viewer"
};

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user ? true : new Error("User not authenticated");
  }
);

const hasWorkspacePrivileges = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user.workspaceId
      ? true
      : new Error("User doesn't have workspace privileges");
  }
);

const hasOwnerPrivileges = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user.role === ROLES.owner
      ? true
      : new Error("User doesn't have owner privileges");
  }
);

const hasAdminPrivileges = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user.role === ROLES.owner || ctx.user.role === ROLES.admin
      ? true
      : new Error("User doesn't have admin privileges");
  }
);

const hasEditorPrivileges = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user.role === ROLES.owner ||
      ctx.user.role === ROLES.admin ||
      ctx.user.role === ROLES.editor
      ? true
      : new Error("User doesn't have editor privileges");
  }
);

const hasViewerPrivileges = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user.role === ROLES.owner ||
      ctx.user.role === ROLES.admin ||
      ctx.user.role === ROLES.editor ||
      ctx.user.role === ROLES.viewer
      ? true
      : new Error("User doesn't have viewer privileges");
  }
);

module.exports = {
  isAuthenticated,
  hasWorkspacePrivileges,
  hasOwnerPrivileges,
  hasAdminPrivileges,
  hasEditorPrivileges,
  hasViewerPrivileges,
  ROLES
};
