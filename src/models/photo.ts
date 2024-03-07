export class Photo {
  public name: string
  public url: string
  public description: string
  public aspectRatio: string

  constructor (name = '', url = '', description = '', aspectRatio = '') {
    this.url = url
    this.name = name
    this.description = description
    this.aspectRatio = aspectRatio
  }
}
