// modules
import React, { useEffect } from "react";
import { useContextSelector } from "use-context-selector";
import _ from "lodash";

// components
import { CanvasTopbar } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";
import { StatefulCanvas } from "./StatefulCanvas";
import { Box } from "../../components/atoms/Layout";

// helpers
import {
  useProjectSubscription,
  CanvasScene,
  useUpdateProjectMutation,
} from "../../generated/graphql";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";
import { getRandomColor } from "../../~reusables/utils/colors";
import { exportAsPNG } from "../../~reusables/utils/saveAndRetrieval";
import { CanvasContext } from "../../~reusables/contexts/CanvasProvider";

export const Project: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { viewBackgroundColor, canvasRef } = useContextSelector(
    CanvasContext,
    (state) => ({
      viewBackgroundColor: state.viewBackgroundColor,
      canvasRef: state.canvasRef,
    })
  );

  let {
    project,
    removeCollaborator,
    addCollaborator,
    updateCollaborator,
    updateScene,
    elements,
  } = useProjectStore((state) => ({
    project: state.project,
    addCollaborator: state.addCollaborator,
    removeCollaborator: state.removeCollaborator,
    updateCollaborator: state.updateCollaborator,
    updateScene: state.updateScene,
    elements: state.elements,
  }));

  const [updateProject] = useUpdateProjectMutation({ ignoreResults: true });

  useProjectSubscription({
    variables: { where: { id: project?.id } },
    onSubscriptionData({ subscriptionData: { data: subData } }) {
      if (subData && subData.project && subData.project.collaboratorPayload) {
        const { data, collaboratorPayload } = subData.project;
        const {
          pointerCoordX,
          pointerCoordY,
          canvasScene,
          userId,
        } = collaboratorPayload;

        switch (canvasScene) {
          case CanvasScene.ClientConnect:
            addCollaborator({
              ...collaboratorPayload,
              pointerCoordX: null,
              pointerCoordY: null,
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
                pointerCoordY,
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
    },
  });

  useEffect(() => {
    updateProject({
      variables: {
        where: { id: project?.id },
        collaboratorPayloadInput: {
          userId: user ? user.id : "",
          color: getRandomColor(),
          ..._.omit(user, [
            "__typename",
            "workspaces",
            "photoId",
            "isVerified",
            "id",
          ]),
          canvasScene: CanvasScene.ClientConnect,
        },
      },
    });

    return () => {
      let dataURL: string | undefined;
      if (canvasRef.current) {
        dataURL = exportAsPNG(
          {
            exportBackground: true,
            viewBackgroundColor,
            saveToDisk: false,
            exportPadding: 40
          },
          canvasRef.current,
          elements
        );
      }

      updateProject({
        variables: {
          where: { id: project?.id },
          projectInput: { dataURL: dataURL ? dataURL : "" },
          collaboratorPayloadInput: {
            userId: user ? user.id : "",
            canvasScene: CanvasScene.ClientDisconnect,
          },
        },
      });
    };
  }, []);

  return (
    <Box>
      <CanvasTopbar />
      <AssetsSidebar />
      <StatefulCanvas />
      <CustomizeSidebar />
    </Box>
  );
};
