export class Photo {
  public name: string
  public smallUrl: string
  public largeUrl: string
  public aspectRatio: number
  public date: string
  public exposure: string
  public aperture: string
  public focalLength: string
  public iso: string
  public description: string
  public title: string
  public type: string
  public visible: boolean

  constructor (name = '', smallUrl = '', largeUrl = '', metadata: {[key: string]: string} = {}, aspectRatio = 0) {
    this.name = name
    this.smallUrl = smallUrl
    this.largeUrl = largeUrl
    this.aspectRatio = aspectRatio
    this.date = metadata.date
    this.exposure = metadata.exposure
    this.aperture = metadata.aperture
    this.focalLength = metadata.focalLength
    this.iso = metadata.iso
    this.description = metadata.description
    this.title = metadata.title
    this.type = metadata.type
    this.visible = true
  }
}
