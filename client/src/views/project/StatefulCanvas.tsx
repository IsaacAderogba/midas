// modules
import React, { useEffect, useCallback } from "react";
import { useContextSelector } from "use-context-selector";
import { throttle, debounce, pick } from "lodash";

// components

// helpers
import { canvasStoreWhiteList } from "../../~reusables/utils/saveAndRetrieval";
import { LOCAL_STORAGE_MIDAS_STATE_KEY } from "../../~reusables/constants/constants";

import { CanvasContext } from "../../~reusables/contexts/CanvasProvider";

import { useUpdateProjectMutation, CanvasScene } from "../../generated/graphql";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";
import { StatelessCanvas } from "./StatelessCanvas";

export const StatefulCanvas: React.FC = () => {
  const userId = useAuthStore(state => (state.user ? state.user.id : ""));
  const { elements, project, collaborators } = useProjectStore(state => ({
    elements: state.elements,
    project: state.project,
    collaborators: state.collaborators
  }));
  const canvasStore = useContextSelector(CanvasContext, state => state);
  console.log(canvasStore);

  const [updateProject] = useUpdateProjectMutation({
    ignoreResults: true,
    fetchPolicy: "no-cache"
  });

  const throttleMouseLocation = useCallback(
    throttle(
      ({
        pointerCoordX,
        pointerCoordY
      }: {
        pointerCoordX: number;
        pointerCoordY: number;
      }) => {
        if (isNaN(pointerCoordX) || isNaN(pointerCoordY)) {
          return;
        }
        updateProject({
          variables: {
            where: { id: project?.id },
            collaboratorPayloadInput: {
              userId,
              pointerCoordX,
              pointerCoordY,
              canvasScene: CanvasScene.MouseLocation
            }
          }
        });
      },
      1000,
      { trailing: true }
    ),
    []
  );

  const debounceUpdateProject = useCallback(
    debounce(() => {
      localStorage.setItem(
        LOCAL_STORAGE_MIDAS_STATE_KEY,
        JSON.stringify(pick(canvasStore, canvasStoreWhiteList))
      );
      updateProject({
        variables: {
          projectInput: {
            elements: JSON.stringify(elements)
          },
          where: { id: project?.id },
          collaboratorPayloadInput: {
            userId,
            canvasScene: CanvasScene.SceneUpdate
          }
        }
      });
    }, 1500),
    []
  );

  useEffect(() => {
    /**
     * Anytime canvasStore changes, make a write to the
     * database after a debounced 3 second pause. Cancel and restart
     * the debounce if the dependency variables change
     */
    debounceUpdateProject();
    return () => {
      debounceUpdateProject.cancel();
    };
  }, [canvasStore, debounceUpdateProject]);

  useEffect(() => {}, [elements]);

  return (
    <StatelessCanvas
      {...canvasStore}
      throttleMouseLocation={throttleMouseLocation}
      elements={elements}
      collaborators={collaborators}
    />
  );
};
