// modules
import React, { createContext, useEffect } from "react";
import { useLocalStore, observer } from "mobx-react";
import { RouteComponentProps } from "react-router-dom";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { MidasElement, Maybe } from "../utils/types";
import { useGetProjectQuery, GetProjectQuery } from "../../generated/graphql";
import { restore } from "../utils/saveAndRetrieval";

interface ICollaborator {
  userId: string;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  email?: Maybe<string>;
  avatarURL?: Maybe<string>;
  color?: Maybe<string>;
  pointerCoordX?: Maybe<number>;
  pointerCoordY?: Maybe<number>;
}
interface IElementsStore {
  elements: MidasElement[];
  collaborators: ICollaborator[];
  project: GetProjectQuery["project"];
  addCollaborator: (collaborator: ICollaborator) => void;
  removeCollaborator: (userId: ICollaborator["userId"]) => void;
  updateCollaborator: (collaborator: ICollaborator) => void;
  updateScene: (elements: MidasElement[]) => void;
}
export const ProjectContext = createContext<IElementsStore>({
  elements: [],
  collaborators: [],
  project: null,
  addCollaborator: () => {},
  removeCollaborator: () => {},
  updateCollaborator: () => {},
  updateScene: () => {}
});

export const useProjectStore = <S,>(
  dataSelector: (store: IElementsStore) => S
) => useStoreState(ProjectContext, contextData => contextData!, dataSelector);

interface IProjectProvider extends RouteComponentProps<{ id: string }> {}

export const ProjectProvider: React.FC<IProjectProvider> = observer(
  ({ children, ...routeProps }) => {
    const { data, loading } = useGetProjectQuery({
      fetchPolicy: "no-cache",
      variables: { where: { id: routeProps.match.params.id } }
    });
    let store = useLocalStore<IElementsStore>(() => ({
      get elements() {
        return [];
      },
      collaborators: [],
      project: null,
      addCollaborator: collaborator => {
        const foundCollaborator = store.collaborators.find(
          c => (c.userId = collaborator.userId)
        );
        if (!foundCollaborator) {
          store.collaborators = [...store.collaborators, collaborator];
        }
      },
      removeCollaborator: userId => {
        store.collaborators = store.collaborators.filter(
          c => c.userId !== userId
        );
      },
      updateCollaborator: collaborator => {
        store.collaborators = store.collaborators.map(c => {
          if (c.userId === collaborator.userId) {
            return { ...collaborator, ...c };
          }
          return c;
        });
      },
      updateScene: elements => {
        restore(elements, store.elements);
      }
    }));

    useEffect(() => {
      if (data) {
        store.project = data["project"];
      }
    }, [data, loading]);

    if (loading) return <div>loading</div>;
    if (!store.project) return <div>Project doesn't exist</div>;

    return (
      <ProjectContext.Provider value={store}>
        {children}
      </ProjectContext.Provider>
    );
  }
);
