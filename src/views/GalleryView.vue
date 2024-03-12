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
    <div class="flex-container flex-nowrap flex-gap flex-justify-space-between" :class="getViewportHorizontal() ? 'flex-row' : 'flex-column'">
      <div class="flex-bypass">
        <img class="previous-button" title="Previous" alt="Previous" loading="lazy" @click="onClickPrevious" v-show="currentIndex > 0 && showButtons" src="../assets/previous.png"/>
        <img id="currentPhoto" class="flex-dynamic photo-expanded" :title="currentPhoto.name" :alt="currentPhoto.name" :src="currentPhoto.url"/>
        <div id="nextPhotoWrapper" class="next-photo-wrapper">
          <img id="nextPhoto" class="next-photo"/>
        </div>
        <img class="next-button" title="Next" alt="Next" loading="lazy" @click="onClickNext" v-show="currentIndex < photos.length - 1 && showButtons" src="../assets/next.png"/>
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
      touchStartX: 0,
      showButtons: true
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
      this.turnPage(true)
    },
    onClickNext () {
      this.turnPage(false)
    },
    turnPage (isPrevious: boolean) {
      const nextPhoto: HTMLImageElement = document.getElementById('nextPhoto') as HTMLImageElement
      const nextPhotoWrapper: HTMLDivElement = document.getElementById('nextPhotoWrapper') as HTMLDivElement
      const currentPhoto: HTMLImageElement = document.getElementById('currentPhoto') as HTMLImageElement
      const currentPhotoRect: DOMRect = currentPhoto.getBoundingClientRect()
      const resizeString = '0.25s'
      const resizeTime = 250
      nextPhoto.setAttribute('src', this.photos[isPrevious ? this.currentIndex - 1 : this.currentIndex + 1].url)
      // Set nextPhoto and wrapper size to that of currentPhoto, hide overflow, and start sliding it into view
      nextPhotoWrapper.style.left = '0'
      nextPhoto.style.height = currentPhotoRect.height + 'px'
      nextPhoto.style.width = currentPhotoRect.width + 'px'
      nextPhoto.style.visibility = 'visible'
      isPrevious ? nextPhoto.style.right = '100%' : nextPhoto.style.left = '100%'
      nextPhoto.style.transition = `${isPrevious ? 'right' : 'left'} 0.5s ease-in-out`
      requestAnimationFrame(() => {
        nextPhotoWrapper.style.height = currentPhotoRect.height + 'px'
        nextPhotoWrapper.style.width = currentPhotoRect.width + 'px'
        isPrevious ? nextPhoto.style.right = '0' : nextPhoto.style.left = '0'
        isPrevious ? nextPhoto.style.left = '' : nextPhoto.style.right = ''
        setTimeout(() => {
          // Sliding into view has finished, check if resize is needed
          if (currentPhoto.naturalHeight !== nextPhoto.naturalHeight || currentPhoto.naturalWidth !== nextPhoto.naturalWidth) {
            // Set nextPhoto left/right so it grows from top-left
            nextPhoto.style.left = '0'
            nextPhoto.style.right = '100%'
            // Hide currentPhoto and buttons, then update bindings
            currentPhoto.style.opacity = '0'
            this.showButtons = false
            this.currentPhoto = this.photos[isPrevious ? --this.currentIndex : ++this.currentIndex]
            requestAnimationFrame(() => {
              // Once currentPhoto is updated
              const updatedPhotoRect: DOMRect = currentPhoto.getBoundingClientRect()
              // Set wrapper size to larger of two photos
              nextPhotoWrapper.style.height = Math.max(updatedPhotoRect.height, currentPhotoRect.height) + 'px'
              nextPhotoWrapper.style.width = Math.max(updatedPhotoRect.width, currentPhotoRect.width) + 'px'
              if (this.photos[isPrevious ? this.currentIndex + 1 : this.currentIndex - 1].aspectRatio < this.photos[this.currentIndex].aspectRatio) {
                // if nextPhoto is taller, transition width first
                this.doWidthTransition(nextPhoto, currentPhotoRect.width, updatedPhotoRect.width, resizeString)
              } else {
                // if nextPhoto is wider, transition height first
                this.doHeightTransition(nextPhoto, currentPhotoRect.height, updatedPhotoRect.height, resizeString)
              }
              setTimeout(() => {
                if (this.photos[isPrevious ? this.currentIndex + 1 : this.currentIndex - 1].aspectRatio > this.photos[this.currentIndex].aspectRatio) {
                  // if nextPhoto is wider, transition width second
                  this.doWidthTransition(nextPhoto, currentPhotoRect.width, updatedPhotoRect.width, resizeString)
                } else {
                  // if nextPhoto is taller, transition height second
                  this.doHeightTransition(nextPhoto, currentPhotoRect.height, updatedPhotoRect.height, resizeString)
                }
                setTimeout(() => {
                  // Once resize transitions are done, display currentPhoto and hide nextPhoto
                  currentPhoto.style.opacity = '1'
                  nextPhoto.style.visibility = 'hidden'
                  isPrevious ? nextPhoto.style.right = '100%' : nextPhoto.style.left = '100%'
                  isPrevious ? nextPhoto.style.left = '' : nextPhoto.style.right = ''
                  this.showButtons = true
                }, resizeTime)
              }, resizeTime)
            })
          } else {
            // If no resize transition is needed, display currentPhoto and hide nextPhoto
            currentPhoto.style.opacity = '1'
            nextPhoto.style.visibility = 'hidden'
            isPrevious ? nextPhoto.style.right = '100%' : nextPhoto.style.left = '100%'
            isPrevious ? nextPhoto.style.left = '' : nextPhoto.style.right = ''
            this.currentPhoto = this.photos[isPrevious ? --this.currentIndex : ++this.currentIndex]
          }
        }, 500)
      })
    },
    doHeightTransition (nextPhoto: HTMLImageElement, currentHeight: number, updatedHeight: number, resizeString: string) {
      // Set height to currentPhoto, add transition, update height to nextPhoto
      nextPhoto.style.height = currentHeight + 'px'
      nextPhoto.style.transition = `height ${resizeString} ease-in-out`
      nextPhoto.style.height = updatedHeight + 'px'
    },
    doWidthTransition (nextPhoto: HTMLImageElement, currentWidth: number, updatedWidth: number, resizeString: string) {
      // Set width to currentPhoto, add transition, update width to nextPhoto
      nextPhoto.style.width = currentWidth + 'px'
      nextPhoto.style.transition = `width ${resizeString} ease-in-out`
      nextPhoto.style.width = updatedWidth + 'px'
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
  overflow: hidden;
  .flex-container {
    &.flex-column {
      align-items: normal;
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
      max-height: 100%;
      max-width: 100%;
      min-height: 0;
      min-width: 0;
    }
    .previous-photo-wrapper, .next-photo-wrapper {
      position: absolute;
      top: 0;
      overflow: hidden;
      img {
        object-fit: cover;
        visibility: hidden;
        position: absolute;
        top: 0;
      }
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
