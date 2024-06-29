import {
  getRoomsFromHttpStorage,
  isSavedToHttpStorage,
  loadFilesFromHttpStorage,
  loadFromHttpStorage,
  saveFilesToHttpStorage,
  saveToHttpStorage,
} from "./httpStorage";

export interface StoredScene {
  sceneVersion: number;
  iv: Uint8Array;
  ciphertext: ArrayBuffer;
}

const httpStorage = {
  isSaved: isSavedToHttpStorage,
  saveToStorageBackend: saveToHttpStorage,
  loadFromStorageBackend: loadFromHttpStorage,
  saveFilesToStorageBackend: saveFilesToHttpStorage,
  loadFilesFromStorageBackend: loadFilesFromHttpStorage,
  getRooms: getRoomsFromHttpStorage,
};

export function getStorageBackend() {
  return httpStorage;
}
