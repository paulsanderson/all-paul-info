<template>
  <h1 class="flex-static">Gallery</h1>
  <div class="flex-dynamic flex-container flex-row flex-wrap flex-gap flex-justify-center width-95 overflow-y">
    <!-- TODO: dynamically downscale images to save bandwidth -->
    <!-- TODO: dynamically add watermarks? -->
    <img v-for="photo in photos" :key="photo.url" class="flex-dynamic photo-loaded" onload="this.style.opacity=1" loading="lazy" :title="photo.name" :alt="photo.name" :src="photo.url" @click="(event) => onClickPhoto(event)"/>
  </div>
  <dialog id="dialog" class="photo-dialog">
    <button class="close-button" @click="onCloseDialog()">x</button>
    <img class="flex-dynamic photo-loaded photo-expanded" onload="this.style.opacity=1" :title="currentPhoto.name" :alt="currentPhoto.name" :src="currentPhoto.url"/>
    <!-- TODO: add photo details here -->
  </dialog>
  <!-- TODO: add ownership/copyright/usage disclaimer, general description of my photography -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'
import { ref, listAll, getStorage, getDownloadURL, FirebaseStorage, StorageReference, ListResult, getMetadata, FullMetadata } from 'firebase/storage'

export default defineComponent({
  name: 'GalleryView',
  data () {
    return {
      // TODO: create photo object for photo properties like metadata, description, time, location, etc.
      photos: new Array<{ url: string, name: string, description: string }>(),
      currentPhoto: { url: '', name: '', description: '' }
    }
  },
  async beforeMount () {
    const firebaseConfig: FirebaseOptions = {
      apiKey: 'AIzaSyChz05zVIVwlI8xu7n0MPITOfgRBPM7bHA',
      authDomain: 'homepage-413204.firebaseapp.com',
      projectId: 'homepage-413204',
      storageBucket: 'homepage-413204.appspot.com',
      messagingSenderId: '517761735577',
      appId: '1:517761735577:web:7eac7d1669f86177be1108',
      measurementId: 'G-5NH4HF3RY0'
    }
    const app: FirebaseApp = initializeApp(firebaseConfig)
    const storage: FirebaseStorage = getStorage(app)
    const photographyRef: StorageReference = ref(storage, 'photography')
    // TODO: use list instead of listAll for its pagination
    const listResult: ListResult = await listAll(photographyRef)
    listResult.items.forEach(async (item: StorageReference) => {
      const url: string = await getDownloadURL(item)
      const metadata: FullMetadata = await getMetadata(item)
      this.photos.push({ url: url, name: metadata.name, description: metadata.timeCreated })
    });
  },
  methods: {
    onClickPhoto (event: MouseEvent) {
      const selectedImage: HTMLImageElement = (event.target as HTMLImageElement)
      this.currentPhoto.url = selectedImage.getAttribute('src') || ''
      this.currentPhoto.name = selectedImage.getAttribute('title') || ''
      this.currentPhoto.description = selectedImage.getAttribute('alt') || ''
      const dialog: HTMLDialogElement = document.getElementById('dialog') as HTMLDialogElement
      dialog.showModal()
      return false
    },
    onCloseDialog () {
      this.currentPhoto.url = ''
      this.currentPhoto.name = ''
      this.currentPhoto.description = ''
      const dialog: HTMLDialogElement = document.getElementById('dialog') as HTMLDialogElement
      dialog.close()
      return false
    }
  }
})
</script>

<style scoped lang="scss">
@import "@/utilities/constants";
.photo-loaded {
  object-fit: contain;
  cursor: pointer;
  max-width: 400px;
  min-width: 150px;
  opacity: 0;
  transition: 1.5s;
  //TODO: add a more intricate transition?
  // transition: transform var(--ease-elastic-4);
  //TODO: dynamically determine aspect ratio?
  // aspect-ratio: 1;
}
.photo-expanded {
  object-fit: scale-down;
  cursor: auto;
  min-height: 80%;
  min-width: 80%;
  max-height: 80%;
  max-width: 80%;
  @media screen and (max-width: $small) {
    min-height: 100%;
    min-width: 100%;
    max-height: 100%;
    max-width: 100%;
  }
}
.photo-dialog {
  .close-button {
    position: absolute;
    top: 4px;
    right: 4px;
    color: $selected-font-color;
    &:hover, &:focus {
      border: 2px solid $hover-link-font-color;
    }
  }
}
#dialog::backdrop {
  background: hsla(0, 0%, 9.41%, 0.50);
  backdrop-filter: blur(5px);
}
</style>
