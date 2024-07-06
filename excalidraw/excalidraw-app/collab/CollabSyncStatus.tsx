import { Tooltip } from "../../packages/excalidraw/components/Tooltip";
import { cloudSyncIcon } from "../../packages/excalidraw/components/icons";
import type { CollabAPI } from "./Collab";

export const CollabSyncStatus = (props: { collabAPI: CollabAPI }) => {
  if (
    !props.collabAPI ||
    !props.collabAPI.isCollaborating() ||
    props.collabAPI.isSavedToFirebase()
  ) {
    return null;
  }

  return (
    <Tooltip label={"Syncing room data..."} nowrap={true}>
      <button
        className="collab-sync-status"
        onClick={() => props.collabAPI.queueSaveToFirebase.flush()}
      >
        {cloudSyncIcon}
        {/* <div className="collab-sync-status">{cloudSyncIcon}</div> */}
      </button>
    </Tooltip>
  );
};
