import { Injectable, Logger } from '@nestjs/common';
import * as Keyv from 'keyv';
import KeyvFile from './FileStorage';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  storagesMap = new Map<string, KeyvFile>();

  constructor() {
    const uri = process.env[`STORAGE_URI`];
    if (!uri) {
      this.logger.warn(
        `STORAGE_URI is undefined, will use non persistant in memory storage`,
      );
    }

    Object.keys(StorageNamespace).forEach((namespace) => {
      const keyv = new KeyvFile({
        filename: `${
          process.env.STORAGE_PATH ?? '/app/storage'
        }/${namespace}.json`,
        writeDelay: 10000,
        encode: JSON.stringify,
        decode: JSON.parse,
      });
      // const keyv = new Keyv({
      //   namespace,
      //   store: new KeyvFile({
      //     filename: `${
      //       process.env.STORAGE_PATH ?? '/app/storage'
      //     }/${namespace}.json`,
      //     writeDelay: 10000,
      //     encode: JSON.stringify,
      //     decode: JSON.parse,
      //   }),
      // });
      // keyv.on('error', (err) =>
      //   this.logger.error(`Connection Error for namespace ${namespace}`, err),
      // );
      this.storagesMap.set(namespace, keyv);
    });
  }
  get(key: string, namespace: StorageNamespace): Promise<Buffer> {
    return this.storagesMap.get(namespace).get(key);
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
