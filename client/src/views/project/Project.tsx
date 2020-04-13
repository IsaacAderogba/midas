// modules
import React, { useEffect } from "react";

// components
import { CanvasTopbar } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";
import { StatefulCanvas } from "./Canvas";

// helpers
import {
  useProjectSubscription,
  CanvasScene,
  useUpdateProjectMutation
} from "../../generated/graphql";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";

export const Project: React.FC = () => {
  const userId = useAuthStore(state => (state.user ? state.user.id : ""));
  let {
    project,
    removeCollaborator,
    addCollaborator,
    updateCollaborator,
    updateScene
  } = useProjectStore(state => ({
    project: state.project,
    addCollaborator: state.addCollaborator,
    removeCollaborator: state.removeCollaborator,
    updateCollaborator: state.updateCollaborator,
    updateScene: state.updateScene
  }));

  const [updateProject] = useUpdateProjectMutation({ ignoreResults: true });

  useProjectSubscription({
    variables: { where: { id: project?.id } },
    onSubscriptionData({ subscriptionData: { data: subData } }) {
      console.log(subData);
      if (subData && subData.project && subData.project.canvasPayload) {
        const { data, mutation, canvasPayload } = subData.project;
        const {
          pointerCoordX,
          pointerCoordY,
          canvasScene,
          userId
        } = canvasPayload;

        switch (canvasScene) {
          case CanvasScene.ClientConnect:
            addCollaborator({
              userId,
              pointerCoordX: 0,
              pointerCoordY: 0
            });
            break;
          case CanvasScene.ClientDisconnect:
            removeCollaborator(userId);
            break;
          case CanvasScene.MouseLocation:
            if (pointerCoordX && pointerCoordY) {
              updateCollaborator({
                userId,
                pointerCoordX,
                pointerCoordY
              });
            }
            break;
          case CanvasScene.SceneUpdate:
            if (data.elements) {
              updateScene(JSON.parse(data.elements));
            }
            break;
          default:
            break;
        }
      }
    }
  });

  useEffect(() => {
    updateProject({
      variables: {
        where: { id: project?.id },
        canvasPayloadInput: { userId, canvasScene: CanvasScene.ClientConnect }
      }
    });

    return () => {
      updateProject({
        variables: {
          where: { id: project?.id },
          canvasPayloadInput: {
            userId,
            canvasScene: CanvasScene.ClientDisconnect
          }
        }
      });
    };
  }, []);

  return (
    <section>
      <CanvasTopbar />
      <AssetsSidebar />
      <StatefulCanvas />
      <CustomizeSidebar />
    </section>
  );
};
