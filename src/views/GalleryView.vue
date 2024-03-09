<template>
  <h1 class="flex-static">Gallery</h1>
  <!-- TODO: add ownership/copyright/usage disclaimer, general description of my photography -->
  <div class="flex-dynamic flex-container flex-row flex-wrap flex-gap flex-justify-center width-95 overflow-y">
    <!-- TODO: dynamically downscale images to save bandwidth -->
    <!-- TODO: dynamically add watermarks? -->
    <img v-for="photo in photos" :key="photo.url" class="flex-dynamic photo-tile" :onload="(event: any) => onPhotoLoad(event)" loading="lazy" :title="photo.name" :alt="photo.name" :src="photo.url" @click="(event) => onClickPhoto(event)"/>
  </div>
  <dialog id="dialog" class="photo-dialog">
    <img class="close-button" title="Close" alt="Close" loading="lazy" @click="onCloseDialog" src="../assets/close.png"/>
    <!-- TODO: add swipe for mobile and L+R support for desktop -->
    <div class="flex-container flex-nowrap flex-gap flex-justify-center" :class="getViewportHorizontal() ? 'flex-row' : 'flex-column'">
      <div class="flex-bypass">
        <img class="previous-button" title="Previous" alt="Previous" loading="lazy" @click="onClickPrevious" v-show="currentIndex > 0" src="../assets/previous.png"/>
        <img id="currentPhoto" class="flex-dynamic photo-expanded" :title="currentPhoto.name" :alt="currentPhoto.name" :src="currentPhoto.url"/>
        <img class="next-button" title="Next" alt="Next" loading="lazy" @click="onClickNext" v-show="currentIndex < photos.length - 1" src="../assets/next.png"/>
      </div>
      <div class="flex-static flex-container flex-column">
        <h3 class="flex-static">Details</h3>
        <div class="flex-static text-no-wrap"><b>Date: </b>{{ currentPhoto.metadata.customMetadata?.dateCreated }}</div>
        <div class="flex-static text-no-wrap">{{ currentPhoto.metadata.customMetadata?.exposure + ' ' +
        currentPhoto.metadata.customMetadata?.aperture + ' ' +
        currentPhoto.metadata.customMetadata?.focalLength + ' ' +
        currentPhoto.metadata.customMetadata?.iso }}</div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'
import { ref, listAll, getStorage, getDownloadURL, FirebaseStorage, StorageReference, ListResult, getMetadata, FullMetadata } from 'firebase/storage'
import { Photo } from '@/models/photo'
// import { MetadataManager } from '@/utilities/metadataManager'

export default defineComponent({
  name: 'GalleryView',
  data () {
    return {
      photos: new Array<Photo>(),
      currentPhoto: new Photo(),
      currentIndex: 0,
      viewportAspectRatio: 0,
      touchStartX: 0
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
      // MetadataManager.setMetadata(item)
      this.photos.push(new Photo(metadata.name, url, metadata))
    })
    window.addEventListener('resize', this.setViewportAspectRatio)
    this.setViewportAspectRatio()
  },
  unmounted () {
    window.removeEventListener('resize', this.setViewportAspectRatio)
  },
  methods: {
    onPhotoLoad (event: Event) {
      const currentImage = event.target as HTMLImageElement
      currentImage.style.opacity = '1'
      const index: number = Array.from(currentImage.parentNode?.children ?? []).indexOf(currentImage)
      const aspectRatio: number = currentImage.naturalWidth / currentImage.naturalHeight
      currentImage.style.aspectRatio = aspectRatio.toString()
      this.photos[index].aspectRatio = aspectRatio
    },
    onClickPhoto (event: MouseEvent) {
      const selectedImage: HTMLImageElement = (event.target as HTMLImageElement)
      this.currentIndex = Array.from(selectedImage.parentNode?.children ?? []).indexOf(selectedImage)
      this.currentPhoto = this.photos[this.currentIndex]
      const dialog: HTMLDialogElement = document.getElementById('dialog') as HTMLDialogElement
      dialog.addEventListener('keyup', this.dialogKeyHandler)
      dialog.addEventListener('touchstart', this.touchStartHandler)
      dialog.addEventListener('touchend', this.touchEndHandler)
      dialog.showModal()
      return false
    },
    onCloseDialog () {
      this.currentPhoto = new Photo()
      const dialog: HTMLDialogElement = document.getElementById('dialog') as HTMLDialogElement
      dialog.removeEventListener('keyup', this.dialogKeyHandler)
      dialog.removeEventListener('touchstart', this.touchStartHandler)
      dialog.removeEventListener('touchend', this.touchEndHandler)
      dialog.close()
      return false
    },
    onClickPrevious () {
      // TODO: add animation or transition?
      this.currentPhoto = this.photos[--this.currentIndex]
    },
    onClickNext () {
      this.currentPhoto = this.photos[++this.currentIndex]
    },
    // eslint-disable-next-line
    setViewportAspectRatio: _.debounce(function (this: any) {
      this.viewportAspectRatio = window.innerWidth / window.innerHeight
    }, 20),
    getViewportHorizontal (): boolean {
      return this.viewportAspectRatio * 0.9 > this.currentPhoto.aspectRatio
    },
    dialogKeyHandler (event: KeyboardEvent) {
      if (this.currentIndex > 0 && event.key === 'ArrowLeft') {
        this.onClickPrevious()
      } else if (this.currentIndex < this.photos.length - 1 && event.key === 'ArrowRight') {
        this.onClickNext()
      }
    },
    touchStartHandler (event: TouchEvent) {
      this.touchStartX = event.changedTouches[0].screenX
    },
    touchEndHandler (event: TouchEvent) {
      const touchEndX: number = event.changedTouches[0].screenX
      if (this.currentIndex > 0 && touchEndX > this.touchStartX + 25) {
        this.onClickPrevious()
      } else if (this.currentIndex < this.photos.length - 1 && touchEndX < this.touchStartX - 25) {
        this.onClickNext()
      }
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
  position: relative;
  .flex-container {
    &.flex-column {
      align-items: center;
      .flex-bypass {
        width: fit-content;
      }
    }
  }
  .flex-bypass {
    position: relative;
    min-height: 0;
    min-width: 0;
    .photo-expanded {
      object-fit: scale-down;
      cursor: auto;
      transition: 1.5s;
      max-height: 100%;
      max-width: 100%;
      min-height: 0;
      min-width: 0;
    }
  }
  .previous-button, .next-button, .close-button {
    position: absolute;
    cursor: pointer;
    transition: 0.15s ease-in-out;
  }
  .previous-button, .next-button {
    top: calc(50% - 20px);
    transform: scale(0.5, 1);
    &:hover, &:focus {
      transform: scale(0.75, 1.5);
    }
    &:active {
      transform: scale(0.5, 1);
    }
  }
  .previous-button {
    left: -25px;
    &:hover, &:focus {
      left: -28px;
    }
    &:active {
      left: -25px;
    }
  }
  .next-button {
    right: -25px;
    &:hover, &:focus {
      right: -28px;
    }
    &:active {
      right: -25px;
    }
  }
  .close-button {
    top: -5px;
    right: -5px;
    transform: scale(0.25, 0.25);
    &:hover, &:focus {
      top: -4px;
      right: -4px;
      transform: scale(0.5, 0.5);
    }
    &:active {
      top: -5px;
      right: -5px;
    }
  }
}
#dialog::backdrop {
  background: hsla(0, 0%, 9.41%, 0.50);
  backdrop-filter: blur(5px);
}
</style>
