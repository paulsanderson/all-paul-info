<template>
<h1 class="flex-static">Jokes</h1>
<div class="flex-dynamic flex-container flex-column width-80">
  <div class="flex-static flex-container flex-row">
    <input class="button-large text-indent-med flex-dynamic" title="Search for a joke" type="search" placeholder="Search..." name="term" v-model="term" @input="onInput">
    <button class="button-large flex-static" title="See favorite jokes" @click="onClickFavorites">Favorites</button>
    <button class="button-large flex-static" title="See a random joke" @click="onClickRandom">Random</button>
  </div>

  <h2 class="flex-static" v-show="response.total_jokes > 0 || term.length > 2">Results</h2>
  <div class="flex-dynamic table" v-show="response.total_jokes > 0 || term.length > 2">
    <div class="row" v-for="result in response.results" :key="result.id">
      <div class="cell">{{ result.joke }}</div>
      <div class="cell">
        <img class="button-small" @click="(event) => onClickFavorite(result, event)" v-show="result.isFavorite" title="Remove from favorites" alt="Unfavorite" loading="lazy" src="../assets/favorite.png"/>
        <img class="button-small" @click="(event) => onClickFavorite(result, event)" v-show="!result.isFavorite" title="Add to favorites" alt="Favorite" loading="lazy" src="../assets/unfavorite.png"/>
      </div>
      <div class="cell">
        <img class="button-small" @click="(event) => onClickCopy(result.joke, event)" title="Copy to clipboard" alt="Copy" loading="lazy" src="../assets/clipboard.png"/>
      </div>
    </div>
  </div>
  <div class="flex-static" v-show="response.total_pages > 1">
    <h2>More Results</h2>
    <ul>
      <li v-for="page in availablePages" :key="page" style="display: inline-block">
        <button :disabled="response.current_page == page" class="button-small" @click="onClickPage(page)">{{ page }}</button>
      </li>
    </ul>
  </div>
  <h3 class="flex-static" v-show="term.length > 2 && response.total_jokes < 1">No jokes found matching {{ term }}</h3>
</div>
<div v-show="showToast" class="toast" :style="{ 'top': toastOffsetY + 'px'}">{{ toastMessage }}</div>
<!-- TODO: add "jokes provided by icanhazjoke.com API" footnote -->
</template>

<script lang="ts">
import { Utilities, Joke, JokeCollection } from '@/utilities/utilities'
import { defineComponent } from 'vue'
import _ from 'lodash'

export default defineComponent({
  name: 'JokesView',
  setup () {
    return {
      term: ''
    }
  },
  data () {
    return {
      response: {
        results: new Array<Joke>(),
        limit: Utilities.getPageSize(),
        current_page: 1,
        next_page: 2,
        previous_page: 1,
        search_term: '',
        total_jokes: 0,
        total_pages: 0
      },
      availablePages: new Array<number>(),
      isBusy: false,
      showToast: false,
      toastOffsetY: 0,
      toastMessage: ''
    }
  },
  methods: {
    // TODO: add component-wide busyCursor using isBusy flag
    async onInput (event: Event) {
      const debounceInput = _.debounce(async () => {
        const searchTerm: string = (event.target as HTMLInputElement).value
        if (!searchTerm) {
          this.$data.response = new JokeCollection()
          return false
        }
        const jokeResults: JokeCollection = await Utilities.fetchJokeByTerm(searchTerm) as JokeCollection
        this.$data.response = jokeResults
        if (jokeResults.total_jokes > 0) {
          const jokeCollection: Array<Joke> = []
          for (const result of jokeResults.results) {
            jokeCollection.push({ id: result.id, joke: result.joke, isFavorite: Utilities.isFavorite(result.id) })
          }
          this.$data.response.results = jokeCollection
        } else {
          this.$data.response.results = []
        }
        this.updateAvailablePages()
        return false
      }, 300)
      return await debounceInput()
    },
    async onClickPage (page: number) {
      // TODO: handle paging favorites using IDs and different API call
      const jokeResults: JokeCollection = (await Utilities.fetchJokeByTermAndPage(this.term, page) as JokeCollection)
      this.$data.response = jokeResults
      this.updateAvailablePages()
      return false
    },
    updateAvailablePages () {
      if (this.$data.response.total_pages === 1) {
        this.$data.availablePages = []
        return
      }
      const availablePages: Array<number> = new Array<number>()
      for (let i = Math.max(1, this.$data.response.current_page - 5); i <= Math.min(this.$data.response.total_pages, this.$data.response.current_page + 5); i++) {
        availablePages.push(i)
      }
      this.$data.availablePages = availablePages
    },
    async onClickCopy (joke: string, event: MouseEvent) {
      if (!navigator.clipboard) {
        throw new Error('Browser does not have clipboard support')
      }
      this.toggleToast(event, 'Copied!')
      await navigator.clipboard.writeText(joke)
      return false
    },
    async onClickFavorite (result: Joke, event: MouseEvent) {
      let favorites: Array<string> = JSON.parse(localStorage.favorites ?? '[]')
      if (result.isFavorite) {
        const index: number = favorites.indexOf(result.id)
        if (index > -1) {
          favorites.splice(index, 1)
        }
        this.toggleToast(event, 'Unfavorited!')
      } else {
        if (favorites) {
          favorites.push(result.id)
        } else {
          favorites = [result.id]
        }
        this.toggleToast(event, 'Favorited!')
      }
      result.isFavorite = !result.isFavorite
      localStorage.favorites = JSON.stringify(favorites)
      return false
    },
    toggleToast (event: MouseEvent, message: string) {
      const targetOffsetY: number = (event.target as Element).getBoundingClientRect().y
      const tableElement: HTMLElement | null | undefined = (event.target as Element).parentElement?.parentElement?.parentElement
      // eslint-disable-next-line
      const tableOffsetY: number = tableElement!.getBoundingClientRect().y
      this.toastOffsetY = targetOffsetY + 5
      console.log(`targetOffsetY: ${targetOffsetY}, tableOffsetY: ${tableOffsetY}`)
      this.toastMessage = message
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 500)
    },
    async onClickFavorites () {
      const favorites: Array<string> = JSON.parse(localStorage.favorites ?? '[]')
      const favoriteJokes: Array<Joke> = []
      for (const favorite of favorites) {
        const joke: Joke = await Utilities.fetchJokeById(favorite)
        favoriteJokes.push({ id: joke.id, joke: joke.joke, isFavorite: true })
      }
      this.$data.response = new JokeCollection(favoriteJokes)
      this.$data.response.total_pages = 1
      this.$data.availablePages = []
      this.term = ''
    },
    async onClickRandom () {
      const randomJoke: Joke = await Utilities.fetchJokeAtRandom()
      this.$data.response = new JokeCollection([{ id: randomJoke.id, joke: randomJoke.joke, isFavorite: Utilities.isFavorite(randomJoke.id) }])
      this.$data.response.total_pages = 1
      this.$data.availablePages = []
      this.term = ''
    }
  }
})
</script>

<style scoped lang="scss">
@import "@/utilities/constants";
.text-indent-med {
  text-indent: 14px;
}

.table {
  height: 0;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  display: block;
  .row {
    height: 34px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    position: relative;
    border: solid 1px $font-color;
    &:hover {
      background-color: $header-footer-background-color;
    }
    .cell {
      height: 31px;
      text-align: left;
      &:first-child {
        flex: 1 1 auto;
        padding: 9px 5px 5px 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        // TODO: support &:selected
        &:hover {
          white-space: wrap;
          text-overflow: visible;
          overflow: visible;
          position: absolute;
          z-index: 999;
          top: 0;
          left: 0;
          max-width: calc(100% - 65px);
          height: auto;
          background-color: $header-footer-background-color;
          border-bottom: solid 1px $font-color;
        }
      }
      &:nth-child(2), &:nth-child(3) {
        flex: 0 0 auto;
        width: 28px;
        padding-top: 3px;
      }
    }
  }
}
.toast {
  position: absolute;
  left: calc(91% - 5px);
  z-index: 999;
  transition: 0.5s;
  color: $font-color;
  font-size: small;
}
</style>
