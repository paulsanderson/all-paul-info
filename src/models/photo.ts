import { FullMetadata } from 'firebase/storage'

export class Photo {
  public name: string
  public url: string
  public metadata: FullMetadata
  public aspectRatio: string

  constructor (name = '', url = '', metadata: FullMetadata = {} as FullMetadata) {
    this.name = name
    this.url = url
    this.metadata = metadata
    this.aspectRatio = ''
  }
}
