// modules
import React from "react";

// components
import { CanvasTopbar } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";
import { StatefulCanvas } from "./Canvas";

// helpers
import { useProjectSubscription } from "../../generated/graphql";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";

export const Project: React.FC = () => {
  const project = useProjectStore(state => state.project);
  console.log(project)
  return (
    <section>
      <CanvasTopbar />
      <AssetsSidebar />
      <StatefulCanvas />
      <CustomizeSidebar />
    </section>
  );
};
