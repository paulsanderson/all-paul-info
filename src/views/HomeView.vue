<template>
  <h1 class="flex-static">Paul Sanderson</h1>
  <div class="flex-dynamic flex-container flex-column page-container">
    <div class="flex-container flex-row">
      <div class="flex-dynamic">
        <h2 class="collapsible-header active" @click="(event) => onClickCollapse(event)">About</h2>
        <div class="collapsible-content active">
          <div class="flex-container flex-row flex-gap flex-justify-center">
            <img class="flex-dynamic large-image" width="266" height="400" title="Paul Sanderson" alt="Paul Sanderson" src="/paulsanderson.webp"/>
            <div class="flex-dynamic align-left" style="max-width: 400px">
              This is the personal page for Paul Sanderson. He is a software developer in Bozeman, Montana, USA.
              Paul enjoys photography, playing guitar, the outdoors, a game of chess, and a variety of studies like history, economics, and linguistics.<br/>
              The <router-link to="/gallery">Gallery</router-link> has a selection of Paul's photography - viewable as tiles, in a dialog, or fullscreen.<br/>
              The <router-link to="/blog">Blog</router-link> has details on which features have been added and which are yet to come.<br/>
              The rest of the site is under construction. It is being built from scratch and is intended to always be a work in progress. Feedback is welcome.
            </div>
          </div>
        </div>
        <h2 class="collapsible-header" @click="(event) => onClickCollapse(event)">Contact</h2>
        <!-- TODO: create contact form -->
        <p class="collapsible-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum dignissim elementum. Nunc rhoncus leo vel vehicula efficitur. Morbi venenatis orci nec euismod aliquam. Nullam lobortis nulla at justo blandit pellentesque. Suspendisse feugiat tempor nisl, nec interdum lorem blandit ut. Donec ultrices tincidunt consectetur. Aenean tellus massa, lacinia ut erat ac, ultricies finibus felis. Donec suscipit lectus eu tortor blandit, at faucibus eros dapibus.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  methods: {
    async onClickCollapse (event: MouseEvent) {
      const targetElement: HTMLElement = event.target as HTMLElement
      targetElement.nextElementSibling?.classList.toggle('active')
      targetElement.classList.toggle('active')
    }
  }
})
</script>

<style scoped lang="scss">
@import "@/utilities/constants";
.large-image {
  border-radius: 10px;
  transition: 0.5s;
  min-width: 266px;
  max-width: 266px;
  object-fit: cover;
  aspect-ratio: 0.665;
  @media screen and (max-width: $small) {
    min-width: 100px;
    max-height: 150px;
  }
  &:hover {
    opacity: 0.5;
  }
}
.align-left {
  text-align: left;
}
</style>
