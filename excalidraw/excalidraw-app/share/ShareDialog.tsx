import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { copyTextToSystemClipboard } from "../../packages/excalidraw/clipboard";
import { trackEvent } from "../../packages/excalidraw/analytics";
import { useI18n } from "../../packages/excalidraw/i18n";
import { KEYS } from "../../packages/excalidraw/keys";
import { Dialog } from "../../packages/excalidraw/components/Dialog";
import {
  copyIcon,
  playerPlayIcon,
  share,
  shareIOS,
  shareWindows,
  tablerCheckIcon,
  UndoIcon,
} from "../../packages/excalidraw/components/icons";
import { TextField } from "../../packages/excalidraw/components/TextField";
import { FilledButton } from "../../packages/excalidraw/components/FilledButton";
import type { CollabAPI } from "../collab/Collab";
import { activeRoomLinkAtom } from "../collab/Collab";
import { atom, useAtom, useAtomValue } from "jotai";

import "./ShareDialog.scss";
import { useUIAppState } from "../../packages/excalidraw/context/ui-appState";
import { AvailableRooms } from "./AvailableRooms";
import { getFrame } from "../../packages/excalidraw/utils";

type OnExportToBackend = () => void;
export type ShareDialogType = "share" | "collaborationOnly";
export type ShareDialogState =
  | { isOpen: false }
  | { isOpen: true; type: ShareDialogType };

export const shareDialogStateAtom = atom<ShareDialogState>({ isOpen: false });

const getShareIcon = () => {
  const navigator = window.navigator as any;
  const isAppleBrowser = /Apple/.test(navigator.vendor);
  const isWindowsBrowser = navigator.appVersion.indexOf("Win") !== -1;

  if (isAppleBrowser) {
    return shareIOS;
  } else if (isWindowsBrowser) {
    return shareWindows;
  }

  return share;
};

export type ShareDialogProps = {
  collabAPI: CollabAPI | null;
  handleClose: () => void;
  onExportToBackend: OnExportToBackend;
  type: ShareDialogType;
};

const ActiveRoomDialog = ({
  collabAPI,
  activeRoomLink,
  handleClose,
}: {
  collabAPI: CollabAPI;
  activeRoomLink: string;
  handleClose: () => void;
}) => {
  const { t } = useI18n();
  const [justCopied, setJustCopied] = useState(false);
  const timerRef = useRef<number>(0);
  const ref = useRef<HTMLInputElement>(null);
  const isShareSupported = "share" in navigator;

  const copyRoomLink = async () => {
    try {
      await copyTextToSystemClipboard(activeRoomLink);
    } catch (e) {
      collabAPI.setCollabError(t("errors.copyToSystemClipboardFailed"));
    }

    setJustCopied(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setJustCopied(false);
    }, 3000);

    ref.current?.select();
  };

  const shareRoomLink = async () => {
    try {
      await navigator.share({
        title: t("roomDialog.shareTitle"),
        text: t("roomDialog.shareTitle"),
        url: activeRoomLink,
      });
    } catch (error: any) {
      // Just ignore.
    }
  };

  return (
    <>
      <h3 className="ShareDialog__active__header">
        {t("labels.liveCollaboration").replace(/\./g, "")}
      </h3>
      <TextField
        defaultValue={collabAPI.getUsername()}
        placeholder="Your name"
        label="Your name"
        onChange={collabAPI.setUsername}
        onKeyDown={(event) => event.key === KEYS.ENTER && handleClose()}
      />
      <div className="ShareDialog__active__linkRow">
        <TextField
          ref={ref}
          label="Current Room Link"
          readonly
          fullWidth
          value={activeRoomLink}
        />
        {isShareSupported && (
          <FilledButton
            size="large"
            variant="icon"
            label="Share"
            icon={getShareIcon()}
            className="ShareDialog__active__share"
            onClick={shareRoomLink}
          />
        )}
        <Popover.Root open={justCopied}>
          <Popover.Trigger asChild>
            <FilledButton
              size="large"
              label="Copy link"
              icon={copyIcon}
              onClick={copyRoomLink}
            />
          </Popover.Trigger>
          <Popover.Content
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            className="ShareDialog__popover"
            side="top"
            align="end"
            sideOffset={5.5}
          >
            {tablerCheckIcon} copied
          </Popover.Content>
        </Popover.Root>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div className="ShareDialog__active__actions">
          <FilledButton
            size="large"
            variant="outlined"
            color="danger"
            label={/* t("roomDialog.button_leaveSession") */ "Leave"}
            icon={UndoIcon}
            onClick={() => {
              trackEvent("share", "room closed");
              window.location.hash = "";
              if (!collabAPI.isCollaborating()) {
                handleClose();
              }
            }}
          />
        </div>
        <span>or</span>
        <div className="ShareDialog__active__actions">
          <FilledButton
            size="large"
            variant="outlined"
            color="danger"
            label={
              /* t("roomDialog.button_leaveSession") */ "Leave & Copy Content"
            }
            // icon={UndoIcon}
            onClick={() => {
              trackEvent("share", "room closed");
              collabAPI.stopCollaboration(true);
              if (!collabAPI.isCollaborating()) {
                handleClose();
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

const ShareDialogInner = (props: ShareDialogProps) => {
  const { t } = useI18n();

  const activeRoomLink = useAtomValue(activeRoomLinkAtom);

  const rooms = props.collabAPI?.getAvailableRooms();

  return (
    <Dialog size="small" onCloseRequest={props.handleClose} title={false}>
      <div className="ShareDialog">
        {props.collabAPI && activeRoomLink ? (
          <ActiveRoomDialog
            collabAPI={props.collabAPI}
            activeRoomLink={activeRoomLink}
            handleClose={props.handleClose}
          />
        ) : null}
        {rooms && props.collabAPI != null ? (
          <>
            <h3 className="ShareDialog__active__header">Other Rooms</h3>
            <AvailableRooms rooms={rooms} collabAPI={props.collabAPI} />

            <h3 className="ShareDialog__active__header">Create a new room</h3>

            <div className="ShareDialog__picker__button">
              <FilledButton
                size="large"
                label={t("roomDialog.button_startSession")}
                icon={playerPlayIcon}
                onClick={() => {
                  trackEvent("share", "room creation", `ui (${getFrame()})`);
                  if (props.collabAPI) {
                    props.collabAPI.startCollaboration(null);
                  }
                }}
              />
            </div>
          </>
        ) : null}

        <div className="ShareDialog__active__description">
          <p>
            <span
              role="img"
              aria-hidden="true"
              className="ShareDialog__active__description__emoji"
            >
              🔒{" "}
            </span>
            {t("roomDialog.desc_privacy")}
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export const ShareDialog = (props: {
  collabAPI: CollabAPI | null;
  onExportToBackend: OnExportToBackend;
}) => {
  const [shareDialogState, setShareDialogState] = useAtom(shareDialogStateAtom);

  const { openDialog } = useUIAppState();

  useEffect(() => {
    if (openDialog) {
      setShareDialogState({ isOpen: false });
    }
  }, [openDialog, setShareDialogState]);

  if (!shareDialogState.isOpen) {
    return null;
  }

  return (
    <ShareDialogInner
      handleClose={() => setShareDialogState({ isOpen: false })}
      collabAPI={props.collabAPI}
      onExportToBackend={props.onExportToBackend}
      type={shareDialogState.type}
    />
  );
};
