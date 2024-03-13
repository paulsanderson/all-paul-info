<template>
  <h1 class="flex-static">Gallery</h1>
  <!-- TODO: add ownership/copyright/usage disclaimer, general description of my photography -->
  <div class="flex-dynamic flex-container flex-row flex-wrap flex-gap flex-justify-center width-95 overflow-y">
    <!-- TODO: dynamically downscale images to save bandwidth? -->
    <!-- TODO: dynamically add watermarks? -->
    <img v-for="photo in photos" :key="photo.url" class="flex-dynamic photo-tile" :onload="(event: any) => onPhotoLoad(event)" loading="lazy" :alt="photo.name" :src="photo.url" @click="(event) => onClickPhoto(event)"/>
  </div>
  <dialog id="dialog" class="photo-dialog">
    <img class="close-button" title="Close" alt="Close" loading="lazy" @click="onCloseDialog" src="../assets/close.png"/>
    <img class="fullscreen-button" title="Fullscreen" alt="Fullscreen" loading="lazy" @click="onClickFullscreen" src="../assets/fullscreen.png"/>
    <div class="flex-container flex-nowrap flex-gap" :class="getViewportHorizontal() ? 'flex-row' : 'flex-column'">
      <div class="flex-bypass">
        <img id="previousButton" class="previous-button" title="Previous" alt="Previous" loading="lazy" @click="onClickPrevious" v-show="currentIndex > 0 && showButtons" src="../assets/previous.png"/>
        <div id="previousPhotoWrapper" class="previous-photo-wrapper">
          <img id="previousPhoto" class="previous-photo"/>
        </div>
        <div id="currentPhotoWrapper" class="current-photo-wrapper" :class="getViewportHorizontal() ? 'flex-row' : 'flex-column'">
          <img id="currentPhoto" class="flex-dynamic current-photo" :onload="onDialogPhotoLoad" :alt="currentPhoto.name" :src="currentPhoto.url"/>
          <div class="fullscreen-overlay details-panel">
            <div class="flex-static"><b>Details</b></div>
            <div class="flex-static text-no-wrap"><b>Date: </b>{{ currentPhoto.metadata.customMetadata?.dateCreated }}</div>
            <div class="flex-static text-no-wrap">{{ currentPhoto.metadata.customMetadata?.exposure + ' ' +
            currentPhoto.metadata.customMetadata?.aperture + ' ' +
            currentPhoto.metadata.customMetadata?.focalLength + ' ' +
            currentPhoto.metadata.customMetadata?.iso }}</div>
          </div>
        </div>
        <div id="nextPhotoWrapper" class="next-photo-wrapper">
          <img id="nextPhoto" class="next-photo"/>
        </div>
        <img id="nextButton" class="next-button" title="Next" alt="Next" loading="lazy" @click="onClickNext" v-show="currentIndex < photos.length - 1 && showButtons" src="../assets/next.png"/>
      </div>
      <div class="flex-static flex-container flex-column details-panel">
        <div class="flex-static"><b>Details</b></div>
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
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  },
  unmounted () {
    window.removeEventListener('resize', this.onWindowResize)
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
    onDialogPhotoLoad () {
      this.updateButtonPosition()
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
    onClickFullscreen () {
      const currentPhoto: HTMLDivElement = document.getElementById('currentPhotoWrapper') as HTMLDivElement
      currentPhoto.requestFullscreen()
    },
    onClickPrevious () {
      this.turnPage(true)
    },
    onClickNext () {
      this.turnPage(false)
    },
    turnPage (isPrevious: boolean) {
      const nextPhoto: HTMLImageElement = document.getElementById(isPrevious ? 'previousPhoto' : 'nextPhoto') as HTMLImageElement
      const nextPhotoWrapper: HTMLDivElement = document.getElementById(isPrevious ? 'previousPhotoWrapper' : 'nextPhotoWrapper') as HTMLDivElement
      const currentPhoto: HTMLImageElement = document.getElementById('currentPhoto') as HTMLImageElement
      const currentPhotoRect: DOMRect = currentPhoto.getBoundingClientRect()
      const resizeString = '0.2s'
      const resizeTime = 200
      nextPhoto.setAttribute('src', this.photos[isPrevious ? this.currentIndex - 1 : this.currentIndex + 1].url)
      // Set nextPhoto and wrapper size to that of currentPhoto, hide overflow, and start sliding it into view
      nextPhotoWrapper.style.left = '0'
      nextPhoto.style.height = currentPhotoRect.height + 'px'
      nextPhoto.style.width = currentPhotoRect.width + 'px'
      nextPhoto.style.visibility = 'visible'
      isPrevious ? nextPhoto.style.right = '100%' : nextPhoto.style.left = '100%'
      nextPhoto.style.transition = `${isPrevious ? 'right' : 'left'} 0.4s ease-in-out`
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
                // if width transition not needed, do height immediately
                if (currentPhotoRect.width === updatedPhotoRect.width) {
                  this.doHeightTransition(nextPhoto, currentPhotoRect.height, updatedPhotoRect.height, resizeString)
                } else {
                  this.doWidthTransition(nextPhoto, currentPhotoRect.width, updatedPhotoRect.width, resizeString)
                }
              } else {
                // if nextPhoto is wider, transition height first
                // if height transition not needed, do width immediately
                if (currentPhotoRect.height === updatedPhotoRect.height) {
                  this.doWidthTransition(nextPhoto, currentPhotoRect.width, updatedPhotoRect.width, resizeString)
                } else {
                  this.doHeightTransition(nextPhoto, currentPhotoRect.height, updatedPhotoRect.height, resizeString)
                }
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
                  this.resetTransitions(currentPhoto, nextPhoto, nextPhotoWrapper, isPrevious)
                  this.updateButtonPosition()
                  this.showButtons = true
                }, resizeTime)
              }, resizeTime)
            })
          } else {
            // If no resize transition is needed, display currentPhoto and hide nextPhoto
            this.resetTransitions(currentPhoto, nextPhoto, nextPhotoWrapper, isPrevious)
            this.currentPhoto = this.photos[isPrevious ? --this.currentIndex : ++this.currentIndex]
          }
        }, 400)
      })
    },
    resetTransitions (currentPhoto: HTMLImageElement, nextPhoto: HTMLImageElement, nextPhotoWrapper: HTMLDivElement, isPrevious: boolean) {
      currentPhoto.style.opacity = '1'
      nextPhotoWrapper.style.height = ''
      nextPhotoWrapper.style.width = ''
      nextPhotoWrapper.style.left = '0'
      nextPhotoWrapper.style.right = '0'
      nextPhoto.style.transition = ''
      isPrevious ? nextPhoto.style.right = '100%' : nextPhoto.style.left = '100%'
      isPrevious ? nextPhoto.style.left = '' : nextPhoto.style.right = ''
      nextPhoto.style.height = ''
      nextPhoto.style.width = ''
      nextPhoto.style.visibility = 'hidden'
      nextPhoto.removeAttribute('src')
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
    onWindowResize: _.debounce(function (this: any) {
      this.viewportAspectRatio = window.innerWidth / window.innerHeight
      this.updateButtonPosition()
    }, 20),
    getViewportHorizontal (): boolean {
      return this.viewportAspectRatio * 0.9 > this.currentPhoto.aspectRatio
    },
    updateButtonPosition () {
      const currentPhoto: HTMLImageElement = document.getElementById('currentPhoto') as HTMLImageElement
      const nextButton: HTMLImageElement = document.getElementById('nextButton') as HTMLImageElement
      const previousButton: HTMLImageElement = document.getElementById('previousButton') as HTMLImageElement
      const currentPhotoHeight: number = currentPhoto.getBoundingClientRect().height
      nextButton.style.top = currentPhotoHeight / 2 - 40 + 'px'
      previousButton.style.top = currentPhotoHeight / 2 - 40 + 'px'
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
      // TODO: prevent pinch gesture from changing pages
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
  padding: 20px;
  position: relative;
  overflow: hidden;
  .flex-bypass {
    position: relative;
    min-height: 0;
    min-width: 0;
    height: 100%;
    width: fit-content;
    .current-photo {
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
    .previous-photo-wrapper {
      left: 0;
      right: 0;
      img {
        right: 100%;
      }
    }
    .next-photo-wrapper {
      left: 0;
      img {
        left: 100%;
      }
    }
  }
  .details-panel {
    align-self: center;
    max-width: 200px;
    min-width: 200px;
    max-height: 100px;
    min-height: 100px;
  }
  .previous-button, .next-button, .close-button, .fullscreen-button {
    position: absolute;
    cursor: pointer;
    transition: 0.15s ease-in-out;
  }
  .previous-button, .next-button {
    top: calc(50% - 20px);
    opacity: 0.75;
    transform: scale(0.5, 2);
    &:hover, &:focus {
      opacity: 1;
      transform: scale(1, 2);
    }
    &:active {
      transform: scale(0.5, 2);
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
  .fullscreen-button, .close-button {
    z-index: 1;
    top: -10px;
    transform: scale(0.5, 0.5);
    &:hover, &:focus {
      top: -5px;
      transform: scale(0.75, 0.75);
    }
    &:active {
      top: -10px;
      transform: scale(0.5, 0.5);
    }
  }
  .fullscreen-button {
    right: 20px;
  }
  .close-button {
    right: -5px;
  }
  .current-photo-wrapper {
    height: 100%;
    width: 100%;
    &:fullscreen {
      display: flex;
      .current-photo {
        flex: 1 1 auto;
      }
      .fullscreen-overlay {
        visibility: visible;
      }
    }
    .fullscreen-overlay {
      flex: 0 0 auto;
      background: $body-background-color;
      color: $hover-link-font-color;
      visibility: hidden;
      margin: 20px;
    }
  }
}
#dialog::backdrop {
  background: hsla(0, 0%, 9.41%, 0.50);
  backdrop-filter: blur(5px);
}
</style>
