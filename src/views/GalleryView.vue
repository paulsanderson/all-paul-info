<template>
  <!-- TODO: make header parallax scroll and include details -->
  <h1 class="flex-static">Gallery</h1>
  <!-- TODO: add ownership/copyright/usage disclaimer, general description of my photography -->
  <div class="flex-dynamic flex-container flex-row flex-wrap flex-sm-gap flex-justify-center width-95 overflow-y">
    <!-- TODO: dynamically downscale images to save bandwidth? -->
    <!-- TODO: dynamically add watermarks? -->
    <img v-for="photo in photos" :key="photo.url" class="flex-dynamic photo-tile" :onload="(event: any) => onPhotoLoad(event)" loading="lazy" tabindex="0" :alt="photo.name" :src="photo.url" @click="(event) => onClickPhoto(event)" @keyup.enter="(event) => onClickPhoto(event)"/>
  </div>
  <dialog id="dialog" class="photo-dialog">
    <img class="close-button" title="Close" alt="Close" @click="onCloseDialog" src="../assets/close.png"/>
    <img class="fullscreen-button" title="Fullscreen" alt="Fullscreen" @click="onClickFullscreen" src="../assets/fullscreen.png"/>
    <div id="currentPhotoWrapper" class="current-photo-wrapper">
      <img class="fullscreen-close-button" title="Close" alt="Close" @click="onCloseFullscreen" src="../assets/close.png"/>
      <div id="previousPhotoWrapper" class="previous-photo-wrapper">
        <img id="previousPhoto" class="previous-photo"/>
      </div>
      <img id="previousButton" class="previous-button" title="Previous" alt="Previous" @click="onClickPrevious" v-show="currentIndex > 0 && showButtons" src="../assets/previous.png"/>
      <img id="currentPhoto" class="current-photo" :onload="setPhotoPosition" :alt="currentPhoto.name" :src="currentPhoto.url"/>
      <img id="nextButton" class="next-button" title="Next" alt="Next" @click="onClickNext" v-show="currentIndex < photos.length - 1 && showButtons" src="../assets/next.png"/>
      <div id="nextPhotoWrapper" class="next-photo-wrapper">
        <img id="nextPhoto" class="next-photo"/>
      </div>
    </div>
    <div id="details" class="flex-container flex-column details-panel">
      <h3 class="flex-static">Details</h3>
      <div class="flex-static flex-container flex-column">
        <div class="flex-static">{{ currentPhoto.metadata.customMetadata?.description }}</div>
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
import { listAll, getDownloadURL, StorageReference, ListResult, getMetadata, FullMetadata } from 'firebase/storage'
import { Photo } from '@/models/photo'
import { Utilities } from '@/utilities/utilities'
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
      showButtons: true,
      isFullscreen: false
    }
  },
  async beforeMount () {
    const photographyRef: StorageReference = Utilities.getStorageReference('photography')
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
    },
    onClickPhoto (event: MouseEvent | KeyboardEvent) {
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
    onCloseFullscreen () {
      document.exitFullscreen()
    },
    onClickFullscreen () {
      const currentPhotoWrapper: HTMLDivElement = document.getElementById('currentPhotoWrapper') as HTMLDivElement
      currentPhotoWrapper.addEventListener('fullscreenchange', this.onChangeFullscreen)
      currentPhotoWrapper.requestFullscreen()
    },
    onChangeFullscreen (event: Event) {
      const currentPhotoWrapper: HTMLDivElement = event.target as HTMLDivElement
      const details: HTMLDivElement = document.getElementById('details') as HTMLDivElement
      details.classList.toggle('fullscreen-overlay')
      if (document.fullscreenElement) {
        this.isFullscreen = true
        currentPhotoWrapper.append(details)
      } else {
        this.isFullscreen = false
        const dialog: HTMLDivElement = currentPhotoWrapper.parentNode as HTMLDivElement
        dialog.append(details)
        setTimeout(() => {
          currentPhotoWrapper.removeEventListener('fullscreenchange', this.onChangeFullscreen)
        }, 100)
      }
    },
    onWindowResize: Utilities.debounce(function (this: { viewportAspectRatio: number, setPhotoPosition: () => void }) {
      this.viewportAspectRatio = window.innerWidth / window.innerHeight
      this.setPhotoPosition()
    }, 20),
    getViewportHorizontal (): boolean {
      return this.viewportAspectRatio * 0.9 > this.currentPhoto.aspectRatio
    },
    dialogKeyHandler (event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' && this.currentIndex > 0) {
        this.onClickPrevious()
      } else if (event.key === 'ArrowRight' && this.currentIndex < this.photos.length - 1) {
        this.onClickNext()
      } else if (event.key === 'Enter') {
        this.onClickFullscreen()
      }
    },
    touchStartHandler (event: TouchEvent) {
      this.touchStartX = event.changedTouches[0].screenX
    },
    touchEndHandler (event: TouchEvent) {
      // TODO: prevent pinch gesture from changing pages
      const touchEndX: number = event.changedTouches[0].screenX
      if (this.currentIndex > 0 && touchEndX > this.touchStartX + 75) {
        this.onClickPrevious()
      } else if (this.currentIndex < this.photos.length - 1 && touchEndX < this.touchStartX - 75) {
        this.onClickNext()
      }
    },
    onClickPrevious () {
      this.turnPage(true)
    },
    onClickNext () {
      this.turnPage(false)
    },
    turnPage (isPrevious: boolean) {
      const nextPhoto: HTMLImageElement = document.getElementById(isPrevious ? 'previousPhoto' : 'nextPhoto') as HTMLImageElement
      nextPhoto.setAttribute('src', this.photos[isPrevious ? this.currentIndex - 1 : this.currentIndex + 1].url)
      if (nextPhoto.complete) {
        nextPhoto.onload = null
        this.doTurnPage(isPrevious, nextPhoto)
      } else {
        nextPhoto.onload = () => this.doTurnPage(isPrevious, nextPhoto)
      }
    },
    doTurnPage (isPrevious: boolean, nextPhoto: HTMLImageElement) {
      const nextPhotoWrapper: HTMLDivElement = document.getElementById(isPrevious ? 'previousPhotoWrapper' : 'nextPhotoWrapper') as HTMLDivElement
      const currentPhoto: HTMLImageElement = document.getElementById('currentPhoto') as HTMLImageElement
      const currentPhotoRect: DOMRect = currentPhoto.getBoundingClientRect()
      const slideTransitionTime = 500
      if (this.isFullscreen) {
        this.currentPhoto = this.photos[isPrevious ? --this.currentIndex : ++this.currentIndex]
        return
      }
      this.doSlideTransition(isPrevious, nextPhoto, nextPhotoWrapper, currentPhotoRect, slideTransitionTime)
      setTimeout(() => {
        if (currentPhoto.naturalHeight !== nextPhoto.naturalHeight || currentPhoto.naturalWidth !== nextPhoto.naturalWidth) {
          // Hide buttons and currentPhoto, fix nextPhoto in place, update currentPhoto binding
          this.showButtons = false
          currentPhoto.style.opacity = '0'
          nextPhotoWrapper.style.position = 'fixed'
          nextPhotoWrapper.style.left = currentPhotoRect.x + 'px'
          nextPhotoWrapper.style.top = currentPhotoRect.y + 'px'
          nextPhotoWrapper.style.width = currentPhotoRect.width + 'px'
          nextPhotoWrapper.style.height = currentPhotoRect.height + 'px'
          this.currentPhoto = this.photos[isPrevious ? --this.currentIndex : ++this.currentIndex]
          requestAnimationFrame(() => {
            if (currentPhoto.complete) {
              nextPhoto.onload = null
              this.doResizeTransition(isPrevious, nextPhoto, nextPhotoWrapper, currentPhoto, currentPhotoRect)
            } else {
              currentPhoto.onload = () => {
                this.doResizeTransition(isPrevious, nextPhoto, nextPhotoWrapper, currentPhoto, currentPhotoRect)
              }
            }
          })
        } else {
          this.currentPhoto = this.photos[isPrevious ? --this.currentIndex : ++this.currentIndex]
          this.resetTransitions(currentPhoto, nextPhoto, nextPhotoWrapper, isPrevious)
        }
      }, slideTransitionTime)
    },
    doSlideTransition (isPrevious: boolean, nextPhoto: HTMLImageElement, nextPhotoWrapper: HTMLDivElement, currentPhotoRect: DOMRect, transitionTime: number) {
      // Set nextPhoto and wrapper size to that of currentPhoto, hide overflow, and start sliding it into view
      nextPhotoWrapper.style.inset = '0 0 0 0'
      nextPhoto.width = currentPhotoRect.width
      nextPhoto.height = currentPhotoRect.height
      nextPhoto.style.visibility = 'visible'
      isPrevious ? nextPhoto.style.right = '100%' : nextPhoto.style.left = '100%'
      isPrevious ? nextPhoto.style.left = '' : nextPhoto.style.right = ''
      nextPhoto.style.transition = `${isPrevious ? 'right' : 'left'} ${transitionTime / 1000}s ease-in-out`
      isPrevious ? nextPhoto.style.right = '0' : nextPhoto.style.left = '0'
      isPrevious ? nextPhoto.style.left = '' : nextPhoto.style.right = ''
    },
    doResizeTransition (isPrevious: boolean, nextPhoto: HTMLImageElement, nextPhotoWrapper: HTMLDivElement, currentPhoto: HTMLImageElement, currentPhotoRect: DOMRect) {
      this.setPhotoPosition()
      const updatedPhotoRect: DOMRect = currentPhoto.getBoundingClientRect()
      const resizeTime: number = currentPhotoRect.width === updatedPhotoRect.width && currentPhotoRect.height === updatedPhotoRect.height ? 0 : 300
      nextPhoto.style.transition = ''
      nextPhoto.style.left = '0'
      nextPhoto.style.top = '0'
      nextPhoto.style.transition = `all ${resizeTime / 1000}s ease-in-out`
      nextPhoto.width = updatedPhotoRect.width
      nextPhoto.height = updatedPhotoRect.height
      nextPhotoWrapper.style.transition = `all ${resizeTime / 1000}s ease-in-out`
      nextPhotoWrapper.style.left = updatedPhotoRect.x + 'px'
      nextPhotoWrapper.style.top = updatedPhotoRect.y + 'px'
      nextPhotoWrapper.style.width = updatedPhotoRect.width + 'px'
      nextPhotoWrapper.style.height = updatedPhotoRect.height + 'px'
      setTimeout(() => {
        this.resetTransitions(currentPhoto, nextPhoto, nextPhotoWrapper, isPrevious)
      }, resizeTime)
    },
    resetTransitions (currentPhoto: HTMLImageElement, nextPhoto: HTMLImageElement, nextPhotoWrapper: HTMLDivElement, isPrevious: boolean) {
      currentPhoto.style.opacity = '1'
      nextPhotoWrapper.style.transition = ''
      nextPhotoWrapper.style.visibility = 'hidden'
      nextPhotoWrapper.style.position = 'absolute'
      nextPhotoWrapper.style.left = '0'
      nextPhotoWrapper.style.top = '0'
      nextPhotoWrapper.style.width = ''
      nextPhotoWrapper.style.height = ''
      nextPhoto.style.transition = ''
      nextPhoto.style.visibility = 'hidden'
      isPrevious ? nextPhoto.style.right = '100%' : nextPhoto.style.left = '100%'
      isPrevious ? nextPhoto.style.left = '' : nextPhoto.style.right = ''
      nextPhoto.removeAttribute('height')
      nextPhoto.removeAttribute('width')
      nextPhoto.removeAttribute('src')
      this.showButtons = true
    },
    setPhotoPosition () {
      const currentPhoto: HTMLImageElement = document.getElementById('currentPhoto') as HTMLImageElement
      const details: HTMLDivElement = document.getElementById('details') as HTMLDivElement
      const dialog: HTMLDivElement = document.getElementById('dialog') as HTMLDivElement
      const dialogRect: DOMRect = dialog.getBoundingClientRect()
      if (dialogRect.width / dialogRect.height > currentPhoto.naturalWidth / currentPhoto.naturalHeight) {
        currentPhoto.height = Math.min(dialogRect.height - 38, currentPhoto.naturalHeight)
        currentPhoto.width = currentPhoto.naturalWidth * currentPhoto.height / currentPhoto.naturalHeight
        const photoRect: DOMRect = currentPhoto.getBoundingClientRect()
        const spareWidth: number = dialogRect.right - photoRect.right - 19 - 40
        if (spareWidth > 200) {
          details.style.inset = 'auto 19px auto auto'
          details.style.maxWidth = spareWidth + 'px'
          dialog.style.overflowY = 'hidden'
        } else {
          this.setDetailsBottomPosition(currentPhoto, details, dialog, dialogRect)
        }
      } else {
        currentPhoto.width = Math.min(dialogRect.width - 38, currentPhoto.naturalWidth)
        currentPhoto.height = currentPhoto.naturalHeight * currentPhoto.width / currentPhoto.naturalWidth
        this.setDetailsBottomPosition(currentPhoto, details, dialog, dialogRect)
      }
    },
    setDetailsBottomPosition (currentPhoto: HTMLImageElement, details: HTMLDivElement, dialog: HTMLDivElement, dialogRect: DOMRect) {
      const photoRect: DOMRect = currentPhoto.getBoundingClientRect()
      const detailsRect: DOMRect = details.getBoundingClientRect()
      const spareHeight: number = dialogRect.bottom - photoRect.bottom
      details.style.maxWidth = ''
      if (spareHeight > detailsRect.height) {
        dialog.style.overflowY = 'hidden'
        details.style.inset = `${photoRect.bottom - 20}px auto auto auto`
      } else {
        dialog.style.overflowY = 'scroll'
        details.style.inset = 'calc(100% - 42px) auto auto auto'
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
  transition: opacity 1.5s ease-in-out;
  opacity: 0;
  max-width: 500px;
  min-width: 350px;
  max-height: 350px;
  min-height: 350px;
  outline: none;
  margin: 4px;
  &:hover, &:focus {
    margin: 2px;
    border: 2px solid $link-font-color;
  }
  &:active {
    margin: 0;
    border: 4px solid $link-font-color;
  }
  //TODO: add a more intricate transition?
  // transition: transform var(--ease-elastic-4);
}
.photo-dialog {
  height: 90%;
  width: 90%;
  position: relative;
  overflow: hidden;
  place-items: center;
  place-content: center;
  &[open] {
    display: flex;
  }
  .current-photo-wrapper {
    display: grid;
    position: relative;
    place-items: center;
    .current-photo {
      flex: 1 1 auto;
      object-fit: scale-down;
      cursor: auto;
    }
    &:fullscreen {
      .fullscreen-close-button {
        visibility: visible;
      }
    }
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
  .details-panel {
    position: absolute;
    text-wrap: balance;
    height: fit-content;
    width: fit-content;
    &.fullscreen-overlay {
      align-self: center;
      background: $body-background-color;
      color: $hover-link-font-color;
      margin: 50px;
      min-width: 200px;
      min-height: 100px;
      padding: 5px;
    }
    @media screen and (max-width: $small) {
      font-size-adjust: 0.3;
    }
  }
  .previous-button, .next-button, .close-button, .fullscreen-button, .fullscreen-close-button {
    position: absolute;
    cursor: pointer;
    transition: 0.15s ease-in-out;
  }
  .previous-button, .next-button {
    transform: scale(0.5, 2);
    top: calc(50% - 40px);
    @media (hover: hover) {
      opacity: 0.4;
      &:hover {
        opacity: 1;
        transform: scale(1, 2);
      }
      &:active {
        transform: scale(0.5, 2);
      }
    }
  }
  .previous-button {
    left: -25px;
    @media (hover: hover) {
      &:hover {
        left: -28px;
      }
      &:active {
        left: -25px;
      }
    }
  }
  .next-button {
    right: -25px;
    @media (hover: hover) {
      &:hover {
        right: -28px;
      }
      &:active {
        right: -25px;
      }
    }
  }
  .fullscreen-button, .close-button {
    z-index: 1;
    top: -10px;
    transform: scale(0.5, 0.5);
    @media (hover: hover) {
      opacity: 0.4;
      &:hover {
        opacity: 1;
        top: -5px;
        transform: scale(0.75, 0.75);
      }
      &:active {
        top: -10px;
        transform: scale(0.5, 0.5);
      }
    }
  }
  .fullscreen-button {
    right: 20px;
  }
  .close-button {
    right: -5px;
  }
  .fullscreen-close-button {
    visibility: hidden;
    z-index: 1;
    top: 10px;
    right: 10px;
    transform: scale(0.75, 0.75);
    opacity: 0.4;
    @media (hover: hover) {
      &:hover {
        top: 12px;
        right: 12px;
        transform: scale(1, 1);
        opacity: 1;
      }
      &:active, &:focus {
        top: 10px;
        right: 10px;
        transform: scale(0.75, 0.75);
      }
    }
  }
}
#dialog::backdrop {
  background: hsla(0, 0%, 9.41%, 0.50);
  backdrop-filter: blur(5px);
}
</style>
