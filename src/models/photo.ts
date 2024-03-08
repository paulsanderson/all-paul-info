import { FullMetadata } from 'firebase/storage'

export class Photo {
  public name: string
  public url: string
  public metadata: FullMetadata
  public aspectRatio: number

  constructor (name = '', url = '', metadata: FullMetadata = {} as FullMetadata, aspectRatio = 0) {
    this.name = name
    this.url = url
    this.metadata = metadata
    this.aspectRatio = aspectRatio
  }
}
