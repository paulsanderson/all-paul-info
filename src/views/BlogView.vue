<template>
  <h1 class="flex-static">Blog</h1>
  <div class="flex-dynamic flex-container flex-column page-container">
    <h3 class="collapsible-header active" @click="(event) => onClickCollapse(event)">2024 Website Updates</h3>
    <div class="collapsible-content active">
      <ul>
        <li>April 3 &ensp;Allow linking to specific photos using query parameters</li>
        <li>April 2 &ensp;Add store pages for gallery photos, add copy link button and toast</li>
        <li>March 31&ensp;Add gallery details to header, auto-collapse/expand on scroll</li>
        <li>March 29&ensp;Update header/footer style and icons</li>
        <li>March 27&ensp;Center photo on dialog, dynamically position details</li>
        <li>March 24&ensp;Combine height and width photo resize transitions</li>
        <li>March 22&ensp;Fix calculation of photo aspect ratio on load and next/previous button positioning</li>
        <li>March 19&ensp;Fixed dialog and button display for Firefox mobile, style improvements</li>
        <li>March 18&ensp;Added descriptions to photos, added resume download functionality</li>
        <li>March 17&ensp;Eliminated dependencies, reduced module size from 290kb to 214kb</li>
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
        <li>Ability to search and sort photos</li>
        <li>Ability to save/like/comment on photos</li>
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
