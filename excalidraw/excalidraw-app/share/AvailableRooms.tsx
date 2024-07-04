import { useState, useEffect, Suspense } from "react";
// import { useI18n } from "../../packages/excalidraw/i18n";
import { RE_COLLAB_LINK, getCollaborationLink } from "../data";
import { KEYS } from "../../packages/excalidraw/keys";
import { usersIcon } from "../../packages/excalidraw/components/icons";
import type { CollabAPI } from "../collab/Collab";
import { ROOM_PASSWORD_LENGTH } from "../app_constants";

export const AvailableRooms = (props: {
  rooms: Promise<{ roomID: string; collaborators: number }[]>;
  collabAPI: CollabAPI;
}) => {
  const [rooms, setRooms] = useState<
    { roomID: string; collaborators: number }[]
  >([]);
  useEffect(() => {
    props.rooms.then((rooms) => setRooms(rooms));
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="ShareDialog__active__available__rooms__list">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomItem
              key={room.roomID}
              room={room}
              collabAPI={props.collabAPI}
            />
          ))
        ) : (
          <div className="ShareDialog__active__available__rooms__list__item">
            No rooms available
          </div>
        )}
      </div>
    </Suspense>
  );
};

const RoomItem = (props: {
  room: { roomID: string; collaborators: number };
  collabAPI: CollabAPI;
}) => {
  // const { t } = useI18n();

  const [openPassword, setOpenPassword] = useState(false);
  let password = "";

  const handleSubmit = () => {
    if (
      props.room.roomID !== props.collabAPI.getCurrentRoomID() &&
      password &&
      password.length === ROOM_PASSWORD_LENGTH &&
      RE_COLLAB_LINK.test(`#room=${props.room.roomID},${password}`)
    ) {
      // window.location.href = "";
      window.location.href = getCollaborationLink({
        roomId: props.room.roomID,
        roomKey: password,
      });
      window.location.reload();
    }
  };

  return (
    <>
      <div
        className="ShareDialog__active__available__rooms__list__item"
        onClick={() => {
          const storedPassword = props.collabAPI.getStoredRoomPassword(
            props.room.roomID,
          );
          if (storedPassword) {
            password = storedPassword;
            handleSubmit();
          } else {
            password = "";

            setOpenPassword(
              !(
                openPassword ||
                props.room.roomID === props.collabAPI.getCurrentRoomID()
              ),
            );
          }
        }}
      >
        <div className="ShareDialog__active__available__rooms__list__item__room">
          <span className="name">
            <div className="icon">
              {usersIcon}
              {props.room.collaborators > 0 && (
                <div className="CollabButton-collaborators">
                  {props.room.collaborators}
                </div>
              )}
            </div>
            {props.room.roomID === props.collabAPI.getCurrentRoomID()
              ? "This room"
              : ""}
          </span>
          <span className="room">{props.room.roomID}</span>
        </div>

        {openPassword && (
          <div
            className="ShareDialog__active__available__rooms__list__item__password"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="password"
              min={ROOM_PASSWORD_LENGTH}
              max={ROOM_PASSWORD_LENGTH}
              onChange={(e) => (password = e.target.value)}
              placeholder="Password"
              onKeyDown={(event) => event.key === KEYS.ENTER && handleSubmit()}
            />
          </div>
        )}
      </div>
    </>
  );
};
