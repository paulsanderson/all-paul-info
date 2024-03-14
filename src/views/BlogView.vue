<template>
  <h1 class="flex-static">Blog</h1>
  <div class="flex-dynamic flex-container flex-column width-95 overflow-y">
    <!-- TODO: add collapsible list of essays, date-stamped, searchable, taggable -->
    <h3 class="collapsible-header active" @click="(event) => onClickCollapse(event)">March 2024 Website Updates</h3>
    <div class="collapsible-content active">
      <ul>
        <li>March 13&ensp;Added fullscreen button to photo dialog, add details to overlay</li>
        <li>March 12&ensp;Added slide and resize transitions when using next/previous buttons</li>
        <li>March 9 &ensp;Added keyboard and swipe support for next/previous buttons</li>
        <li>March 8 &ensp;Determined photo and details position in dialog dynamically depending on photo aspect ratio</li>
        <li>March 7 &ensp;Added photo metadata and displayed in details panel on photo dialog</li>
        <li>March 6 &ensp;Added photo dialog on tile click, with next/previous/close buttons</li>
        <li>March 5 &ensp;Fix project and package configurations, gitignore, upgrade Typescript version</li>
        <li>March 4 &ensp;Added gallery page with tiles for photos, populated firestore bucket with photos</li>
        <li>March 2 &ensp;Added homepage with portrait, biography, resume, collapsible headers; improve loading, favicon, and page title</li>
        <li>March 1 &ensp;Domain acquired, github repository created, firebase hosting setup, website launched</li>
      </ul>
    </div>
    <h3 class="collapsible-header active" @click="(event) => onClickCollapse(event)">Upcoming Website Features</h3>
    <div class="collapsible-content active">
      <ul>
        <li>Photo description and fullscreen overlay display</li>
        <li>Ability to search and sort photos</li>
        <li>Ability to share photo links</li>
        <li>Gallery print shop integration</li>
        <li>Ability to like/comment on photos</li>
        <li>Ability to download resume</li>
        <li>Create contact form</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlogView',
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
ul {
  li {
    font-family: 'Hack';
    text-align: start;
  }
}
</style>
