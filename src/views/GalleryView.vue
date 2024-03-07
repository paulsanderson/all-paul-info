<template>
  <h1 class="flex-static">Gallery</h1>
  <div class="flex-dynamic flex-container flex-row flex-wrap flex-gap flex-justify-center width-95 overflow-y">
    <!-- TODO: dynamically downscale images to save bandwidth -->
    <!-- TODO: dynamically add watermarks? -->
    <img v-for="photo in photos" :key="photo.url" class="flex-dynamic photo-tile" :onload="(event: any) => onPhotoLoad(event)" loading="lazy" :title="photo.name" :alt="photo.name" :src="photo.url" @click="(event) => onClickPhoto(event)"/>
  </div>
  <dialog id="dialog" class="photo-dialog">
    <button class="close-button" @click="onCloseDialog()">x</button>
    <!-- TODO: add swipe for mobile and L+R support for desktop -->
    <button class="previous-button" @click="onClickPrevious()" v-show="currentIndex > 0">&lt;</button>
    <button class="next-button" @click="onClickNext()" v-show="currentIndex < photos.length - 1">&gt;</button>
    <div class="flex-container flex-row flex-nowrap flex-gap">
      <img id="currentPhoto" class="flex-dynamic photo-expanded" :title="currentPhoto.name" :alt="currentPhoto.name" :src="currentPhoto.url"/>
      <!-- TODO: add collapsible Details header, default to expanded, row/column depending on aspect ratio -->
    </div>
  </dialog>
  <!-- TODO: add ownership/copyright/usage disclaimer, general description of my photography -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'
import { ref, listAll, getStorage, getDownloadURL, FirebaseStorage, StorageReference, ListResult, getMetadata, FullMetadata } from 'firebase/storage'
import { Photo } from '@/models/photo'

export default defineComponent({
  name: 'GalleryView',
  data () {
    return {
      photos: new Array<Photo>(),
      currentPhoto: new Photo(),
      currentIndex: 0
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
    const listResult: ListResult = await listAll(photographyRef)
    listResult.items.forEach(async (item: StorageReference) => {
      const url: string = await getDownloadURL(item)
      const metadata: FullMetadata = await getMetadata(item)
      this.photos.push(new Photo(metadata.name, url, metadata.timeCreated))
    })
  },
  methods: {
    onPhotoLoad (event: Event) {
      const currentImage = event.target as HTMLImageElement
      currentImage.style.opacity = '1'
      const index: number = Array.from(currentImage.parentNode?.children ?? []).indexOf(currentImage)
      const imageRect: DOMRect = currentImage.getBoundingClientRect()
      const aspectRatio: string = (imageRect.x / imageRect.y).toString()
      currentImage.style.aspectRatio = aspectRatio
      this.photos[index].aspectRatio = aspectRatio
    },
    onClickPhoto (event: MouseEvent) {
      const selectedImage: HTMLImageElement = (event.target as HTMLImageElement)
      this.currentIndex = Array.from(selectedImage.parentNode?.children ?? []).indexOf(selectedImage)
      this.currentPhoto = new Photo(selectedImage.getAttribute('title') ?? '', selectedImage.getAttribute('src') ?? '', selectedImage.getAttribute('alt') ?? '', selectedImage.getAttribute('aspectRatio') ?? '')
      const dialog: HTMLDialogElement = document.getElementById('dialog') as HTMLDialogElement
      dialog.showModal()
      return false
    },
    onCloseDialog () {
      this.currentPhoto = new Photo()
      const dialog: HTMLDialogElement = document.getElementById('dialog') as HTMLDialogElement
      dialog.close()
      return false
    },
    onClickPrevious () {
      // TODO: add animation or transition?
      this.currentPhoto = this.photos[--this.currentIndex]
    },
    onClickNext () {
      this.currentPhoto = this.photos[++this.currentIndex]
    }
  }
})
</script>

<style scoped lang="scss">
@import "@/utilities/constants";
.photo-tile {
  object-fit: cover;
  cursor: pointer;
  transition: 1.5s;
  opacity: 0;
  max-width: 500px;
  min-width: 350px;
  max-height: 350px;
  min-height: 350px;
  //TODO: add a more intricate transition?
  // transition: transform var(--ease-elastic-4);
}
.photo-dialog {
  height: 90%;
  width: 90%;
  .photo-expanded {
    object-fit: scale-down;
    cursor: auto;
    transition: 1.5s;
    max-height: 100%;
    max-width: 100%;
  }
  .close-button {
    position: absolute;
    top: 4px;
    right: 4px;
    color: $selected-font-color;
    &:hover, &:focus {
      border: 2px solid $hover-link-font-color;
    }
  }
  .previous-button, .next-button {
    position: absolute;
    top: 50%;
    color: $selected-font-color;
    &:hover, &:focus {
      border: 2px solid $hover-link-font-color;
    }
  }
  .previous-button {
    left: 0;
  }
  .next-button {
    right: 0;
  }
}
#dialog::backdrop {
  background: hsla(0, 0%, 9.41%, 0.50);
  backdrop-filter: blur(5px);
}
</style>
