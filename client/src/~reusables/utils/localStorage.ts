import {
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_WORKSPACE_KEY,
} from "../constants/constants";

export const setLocalStorageTokenKey = (token: string) => {
  localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
};

export const setLocalStorageWorkspaceKey = (workspaceId: string) => {
  localStorage.setItem(LOCAL_STORAGE_WORKSPACE_KEY, workspaceId);
};

export const getLocalStorageTokenKey = () =>
  localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

export const getLocalStorageWorkspaceKey = () =>
  localStorage.getItem(LOCAL_STORAGE_WORKSPACE_KEY);

export const getAuthorizationToken = () =>
  `${getLocalStorageWorkspaceKey()} ${getLocalStorageTokenKey()}`;
