import { Injectable, Logger } from '@nestjs/common';
import * as Keyv from 'keyv';
import KeyvFile from './FileStorage';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  storagesMap = new Map<string, KeyvFile>();

  constructor() {
    Object.keys(StorageNamespace).forEach((namespace) => {
      const keyv = new KeyvFile({
        filename: `${
          process.env.STORAGE_PATH ?? '/app/storage'
        }/${namespace}.json`,
        writeDelay: 10000,
        encode: JSON.stringify,
        decode: JSON.parse,
      });

      this.storagesMap.set(namespace, keyv);
    });
  }
  get(key: string, namespace: StorageNamespace): Buffer | undefined {
    return this.storagesMap.get(namespace).has(key)
      ? Buffer.from(this.storagesMap.get(namespace).get(key))
      : undefined;
  }
  async keys(namespace: StorageNamespace): Promise<string[]> {
    return this.storagesMap.get(namespace).keys();
  }
  async has(key: string, namespace: StorageNamespace): Promise<boolean> {
    return !!(await this.storagesMap.get(namespace).get(key));
  }
  set(key: string, value: Buffer, namespace: StorageNamespace): Promise<true> {
    return this.storagesMap.get(namespace).set(key, value);
  }
}

export enum StorageNamespace {
  SCENES = 'SCENES',
  ROOMS = 'ROOMS',
  FILES = 'FILES',
}
