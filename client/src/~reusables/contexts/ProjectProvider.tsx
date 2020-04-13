// modules
import React, { createContext, useEffect } from "react";
import { useLocalStore } from "mobx-react";
import { RouteComponentProps } from "react-router-dom";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { MidasElement } from "../utils/types";
import { useGetProjectQuery, GetProjectQuery } from "../../generated/graphql";

interface IProjectCollaborator {
  userId: string;
  pointerCoordsX: number;
  pointerCoordsY: number;
}
interface IElementsStore {
  elements: MidasElement[];
  projectCollaborators: IProjectCollaborator[];
  project: GetProjectQuery["project"];
}
export const ProjectContext = createContext<IElementsStore>({
  elements: [],
  projectCollaborators: [],
  project: null
});

export const useProjectStore = <S,>(
  dataSelector: (store: IElementsStore) => S
) => useStoreState(ProjectContext, contextData => contextData!, dataSelector);

interface IProjectProvider extends RouteComponentProps<{ id: string }> {}

export const ProjectProvider: React.FC<IProjectProvider> = ({
  children,
  ...routeProps
}) => {
  const { data, loading } = useGetProjectQuery({
    fetchPolicy: "no-cache",
    variables: { where: { id: routeProps.match.params.id } }
  });
  let store = useLocalStore<IElementsStore>(() => ({
    get elements() {
      return [];
    },
    projectCollaborators: [],
    project: null
  }));

  useEffect(() => {
    if (data) {
      store.project = data["project"];
    }
  }, [data, loading]);

  return (
    <ProjectContext.Provider value={store}>{children}</ProjectContext.Provider>
  );
};
