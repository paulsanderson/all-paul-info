export class Photo {
  public name: string
  public url: string
  public aspectRatio: number
  public dateCreated: string
  public exposure: string
  public aperture: string
  public focalLength: string
  public iso: string
  public description: string
  public title: string

  constructor (name = '', url = '', metadata: {[key: string]: string} = {}, aspectRatio = 0) {
    this.name = name
    this.url = url
    this.aspectRatio = aspectRatio
    this.dateCreated = metadata.dateCreated
    this.exposure = metadata.exposure
    this.aperture = metadata.aperture
    this.focalLength = metadata.focalLength
    this.iso = metadata.iso
    this.description = metadata.description
    this.title = metadata.title
  }
}
