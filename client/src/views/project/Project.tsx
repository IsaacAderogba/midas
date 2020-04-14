// modules
import React, { useEffect } from "react";
import _ from "lodash";

// components
import { CanvasTopbar } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";
import { StatefulCanvas } from "./StatefulCanvas";

// helpers
import {
  useProjectSubscription,
  CanvasScene,
  useUpdateProjectMutation
} from "../../generated/graphql";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";
import { getRandomColor } from "../../~reusables/utils/colors";

export const Project: React.FC = () => {
  const user = useAuthStore(state => state.user);

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
      if (subData && subData.project && subData.project.canvasPayload) {
        const { data, canvasPayload } = subData.project;
        const {
          pointerCoordX,
          pointerCoordY,
          canvasScene,
          userId
        } = canvasPayload;

        switch (canvasScene) {
          case CanvasScene.ClientConnect:
            addCollaborator({
              ...canvasPayload,
              pointerCoordX: null,
              pointerCoordY: null
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
          // case CanvasScene.SceneUpdate:
          //   if (data && data.elements) {
          //     updateScene(JSON.parse(data.elements));
          //   }
          //   break;
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
        canvasPayloadInput: {
          userId: user ? user.id : "",
          color: getRandomColor(),
          ..._.omit(user, [
            "__typename",
            "workspaces",
            "photoId",
            "isVerified",
            "id"
          ]),
          canvasScene: CanvasScene.ClientConnect
        }
      }
    });

    return () => {
      updateProject({
        variables: {
          where: { id: project?.id },
          canvasPayloadInput: {
            userId: user ? user.id : "",
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
