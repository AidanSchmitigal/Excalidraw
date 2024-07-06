import React, { useState } from "react";
import { t } from "../i18n";

import { Dialog } from "./Dialog";
import { useExcalidrawActionManager, useExcalidrawContainer } from "./App";
import { ToolButton } from "./ToolButton";
import { Card } from "./Card";
import { actionSaveFileToDisk } from "../actions";

export const ErrorDialog = ({
  children,
  onClose,
}: {
  children?: React.ReactNode;
  onClose?: () => void;
}) => {
  const [modalIsShown, setModalIsShown] = useState(!!children);
  const { container: excalidrawContainer } = useExcalidrawContainer();

  const actionManager = useExcalidrawActionManager();

  const handleClose = React.useCallback(() => {
    setModalIsShown(false);

    if (onClose) {
      onClose();
    }
    // TODO: Fix the A11y issues so this is never needed since we should always focus on last active element
    excalidrawContainer?.focus();
  }, [onClose, excalidrawContainer]);

  return (
    <>
      {modalIsShown && (
        <Dialog
          size="small"
          onCloseRequest={handleClose}
          title={t("errorDialog.title")}
        >
          <div style={{ whiteSpace: "pre-wrap" }}>{children}</div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Card color="lime">
              <ToolButton
                className="Card-button"
                type="button"
                title={t("exportDialog.disk_button")}
                aria-label={t("exportDialog.disk_button")}
                showAriaLabel={true}
                onClick={() => {
                  actionManager.executeAction(actionSaveFileToDisk, "ui");
                }}
              />
            </Card>
          </div>
        </Dialog>
      )}
    </>
  );
};
