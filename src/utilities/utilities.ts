import { FirebaseApp, initializeApp } from 'firebase/app'
import { FirebaseStorage, StorageReference, getStorage, ref } from 'firebase/storage'
import * as firebaseOptions from '../../firebaseOptions.json'

export class Utilities {
  public static debounce = (fn: (...params: unknown[]) => unknown, wait: number, immed = false) => {
    let timer: NodeJS.Timeout | undefined
    return function (this: unknown, ...args: unknown[]) {
      if (timer === undefined && immed) {
        fn.apply(this, args)
      }
      clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), wait)
      return timer
    }
  }

  public static getStorageReference (folder: string): StorageReference {
    const app: FirebaseApp = initializeApp(firebaseOptions)
    const storage: FirebaseStorage = getStorage(app)
    return ref(storage, folder)
  }
}
