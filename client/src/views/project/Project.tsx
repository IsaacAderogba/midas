// modules
import React from "react";

// components
import { CanvasTopbar } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";
import { StatefulCanvas } from "./Canvas";

// helpers
import { useProjectSubscription, CanvasScene } from "../../generated/graphql";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";

export const Project: React.FC = () => {
  const project = useProjectStore(state => state.project);
  useProjectSubscription({
    variables: { where: { id: project?.id } },
    onSubscriptionData({ subscriptionData: { data: subData } }) {
      if (subData && subData.project && subData.project.canvasPayload) {
        const { data, mutation, canvasPayload } = subData.project;
        const {
          pointerCoordX,
          pointerCoordY,
          canvasScene,
          workspaceUserId
        } = canvasPayload;

        switch (canvasScene) {
          case CanvasScene.ClientConnect:
            break;
          case CanvasScene.ClientDisconnect:
            break;
          case CanvasScene.MouseLocation:
            break;
          case CanvasScene.SceneUpdate:
            break;
          default:
            break;
        }
      }
    }
  });

  console.log(project);
  return (
    <section>
      <CanvasTopbar />
      <AssetsSidebar />
      <StatefulCanvas />
      <CustomizeSidebar />
    </section>
  );
};
