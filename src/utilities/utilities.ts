export type Joke = {
  id: string
  joke: string
  isFavorite: boolean
}

export class JokeCollection {
  public results: Array<Joke>
  // eslint-disable-next-line
  public current_page: number
  public limit: number
  // eslint-disable-next-line
  public next_page: number
  // eslint-disable-next-line
  public previous_page: number
  // eslint-disable-next-line
  public search_term: string
  // eslint-disable-next-line
  public total_jokes: number
  // eslint-disable-next-line
  public total_pages: number

  constructor (results: Array<Joke> = [],
    current_page = 1,
    next_page = 2,
    previous_page = 1,
    search_term = '') {
    this.results = results
    // eslint-disable-next-line
    this.current_page = current_page
    this.limit = Utilities.getPageSize()
    // eslint-disable-next-line
    this.next_page = next_page
    // eslint-disable-next-line
    this.previous_page = previous_page
    // eslint-disable-next-line
    this.search_term = search_term
    // eslint-disable-next-line
    this.total_jokes = results.length
    // eslint-disable-next-line
    this.total_pages = results.length / Utilities.getPageSize()
  }
}

const baseURL = 'https://icanhazdadjoke.com/'
const headers: Headers = new Headers({
  Accept: 'application/json',
  'User-Agent': 'My Library (https://github.com/paulsanderson/repo)'
})

export class Utilities {
  public static getPageSize (): number {
    return 20
  }

  public static async fetchJokeAtRandom (): Promise<Joke> {
    return await this.doFetch(baseURL) as Joke
  }

  public static async fetchJokeById (id: string): Promise<Joke> {
    return await this.doFetch(`${baseURL}j/${id}`) as Joke
  }

  public static async fetchJokeByTerm (term: string): Promise<JokeCollection> {
    return await this.doFetch(`${baseURL}search?term=${term}`) as JokeCollection
  }

  public static async fetchJokeByTermAndPage (term: string, page: number): Promise<JokeCollection> {
    return await this.doFetch(`${baseURL}search?term=${term}&page=${page}`) as JokeCollection
  }

  private static async doFetch (url: string): Promise<Joke | JokeCollection> {
    const response: Response = await fetch(url, {
      method: 'GET',
      headers: headers
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return await response.json()
  }

  public static isFavorite (id: string): boolean {
    const favorites: Array<string> = JSON.parse(localStorage.favorites ?? '[]')
    const index: number = favorites.indexOf(id)
    return index > -1
  }

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
}
