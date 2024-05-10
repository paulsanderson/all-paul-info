<template>
  <h1 id="galleryHeader" class="flex-static collapsible-header active" @click="(event) => onClickCollapse(event)">Gallery</h1>
  <div class="gallery-header-content collapsible-content active">
    <div class="flex-container flex-row">
      <div class="flex-dynamic">
        All photos are the property of Paul Sanderson. Most photos are available for purchase in higher quality.
        If you prefer to browse the store directly, you may do so <a target="_blank" href="https://2-paul-sanderson.pixels.com/">here</a>
      </div>
      <div class="flex-static sort-wrapper">
        <img id="sortButton" class="sort-button" title="Sort" alt="Sort" @click="onClickSort" src="../assets/sort.png"/>
        <img id="resetSortButton" class="reset-sort-button" v-show="hasSetSort" title="Reset Sort" alt="Reset Sort" @click="onClickResetSort" src="../assets/reset.png"/>
        <div id="sortPopup" class="flex-container flex-column sort-popup">
          <div class="flex-static sort-item selected" @click="(event) => onSortSelected(event.target as HTMLDivElement)">Newest First</div>
          <div class="flex-static sort-item" @click="(event) => onSortSelected(event.target as HTMLDivElement)">Oldest First</div>
        </div>
      </div>
      <div class="flex-static filter-wrapper">
        <img id="filterButton" class="filter-button" title="Filter" alt="Filter" @click="onClickFilter" src="../assets/filter.png"/>
        <img id="resetFilterButton" class="reset-filter-button" v-show="hasSetFilter" title="Reset Filter" alt="Reset Filter" @click="onClickResetFilter" src="../assets/reset.png"/>
        <div id="filterPopup" class="flex-container flex-column filter-popup">
          <div class="flex-static filter-item selected" @click="(event) => onFilterSelected(event.target as HTMLDivElement)">Wildlife</div>
          <div class="flex-static filter-item selected" @click="(event) => onFilterSelected(event.target as HTMLDivElement)">Landscape</div>
          <div class="flex-static filter-item selected" @click="(event) => onFilterSelected(event.target as HTMLDivElement)">Portrait</div>
          <div class="flex-static filter-item selected" @click="(event) => onFilterSelected(event.target as HTMLDivElement)">Street</div>
          <div class="flex-static filter-item selected" @click="(event) => onFilterSelected(event.target as HTMLDivElement)">Astro</div>
          <div class="flex-static filter-item selected" @click="(event) => onFilterSelected(event.target as HTMLDivElement)">Macro</div>
        </div>
      </div>
      <div class="flex-static search-wrapper">
        <img id="searchButton" class="search-button" title="Search" alt="Search" @click="onClickSearch" src="../assets/search.png"/>
        <img id="resetSearchButton" class="reset-search-button" v-show="hasSetSearch" title="Reset Search" alt="Reset Search" @click="onClickResetSearch" src="../assets/reset.png"/>
        <div id="searchPopup" class="search-popup flex-container flex-row">
          <input id="searchField" autocomplete="off" class="search-field flex-static" title="Search photos" type="search" placeholder="Search..." name="term" v-model="searchTerm" @input="onSearchFieldChanged">
          <select id="searchType" class="search-select flex-static" @input="onSearchChanged">
            <option>Type...</option>
            <option>Name</option>
            <option>Description</option>
            <option>Title</option>
            <option>Date</option>
            <option>Exposure</option>
            <option>Aperture</option>
            <option>Focal Length</option>
            <option>ISO</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <div id="gallery" class="flex-dynamic flex-container flex-row flex-wrap flex-sm-gap flex-justify-center page-container">
    <img v-for="photo in photos" v-show="photo.matchesSearch && photo.matchesFilter" :key="photo.smallUrl" class="flex-dynamic photo-tile" :onload="(event: any) => event.target.style.opacity = '1'" loading="lazy" tabindex="0" :alt="photo.name" :src="photo.smallUrl" @click="(event) => onClickPhoto(event)" @keyup.enter="(event) => onClickPhoto(event)"/>
  </div>
  <dialog id="dialog" class="photo-dialog">
    <img class="button-base close-button" title="Close" alt="Close" @click="onClickCloseDialog" src="../assets/close.png"/>
    <img class="button-base fullscreen-button" title="Fullscreen" alt="Fullscreen" @click="onClickFullscreen" src="../assets/fullscreen.png"/>
    <img class="button-base copy-button" title="Copy Link" alt="Copy Link" @click="onClickCopyLink" src="../assets/copy.png"/>
    <div v-show="showToast" class="toast">Copied Link!</div>
    <div id="currentPhotoWrapper" class="current-photo-wrapper">
      <img class="button-base fullscreen-close-button" title="Close" alt="Close" @click="onClickCloseFullscreen" src="../assets/close.png"/>
      <div id="previousPhotoWrapper" class="previous-photo-wrapper">
        <img id="previousPhoto" class="previous-photo"/>
      </div>
      <img id="previousButton" class="button-base previous-button" title="Previous" alt="Previous" @click="onClickPrevious" v-show="currentIndex > 0 && showButtons" src="../assets/previous.png"/>
      <img id="currentPhoto" class="current-photo" :alt="currentPhoto.name" :src="currentPhoto.largeUrl"/>
      <img id="nextButton" class="button-base next-button" title="Next" alt="Next" @click="onClickNext" v-show="currentIndex < photos.length - 1 && showButtons" src="../assets/next.png"/>
      <div id="nextPhotoWrapper" class="next-photo-wrapper">
        <img id="nextPhoto" class="next-photo"/>
      </div>
    </div>
    <div id="details" class="flex-container flex-column details-panel">
      <h4 class="flex-static">Details</h4>
      <div class="flex-static flex-container flex-column">
        <h4 class="flex-static photo-title">{{ formatTitle(currentPhoto.title) }}</h4>
        <div class="flex-static">{{ currentPhoto.description }}</div>
        <div class="flex-static text-no-wrap"><u>Date</u>: {{ currentPhoto.date }}</div>
        <div class="flex-static text-no-wrap">{{ currentPhoto.exposure + ' &bull; ' +
        currentPhoto.aperture + ' &bull; ' +
        currentPhoto.focalLength + ' &bull; ' +
        currentPhoto.iso }}</div>
        <div v-show="currentPhoto.title" class="flex-static text-no-wrap">
          <a class="shop-link" target="_blank" :href="'https://fineartamerica.com/featured/' + currentPhoto.title + '-paul-sanderson.html'">Shop Products</a>
        </div>
        <div><a></a></div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { listAll, getDownloadURL, StorageReference, ListResult, getMetadata, FullMetadata, FirebaseStorage, getStorage, ref } from 'firebase/storage'
import { Photo } from '@/models/photo'
import { Utilities } from '@/utilities/utilities'
import { FirebaseApp, initializeApp } from 'firebase/app'
import * as firebaseOptions from '../../firebaseOptions.json'
// import { MetadataManager } from '@/utilities/metadataManager'

export default defineComponent({
  name: 'GalleryView',
  setup () {
    return {
      searchTerm: ''
    }
  },
  data () {
    return {
      photos: new Array<Photo>(),
      currentPhoto: new Photo(),
      currentIndex: 0,
      viewportAspectRatio: 0,
      touchStartX: 0,
      showButtons: true,
      isFullscreen: false,
      showToast: false,
      storage: {} as FirebaseStorage,
      hasSetSearch: false,
      hasSetSort: false,
      hasSetFilter: false
    }
  },
  mounted () {
    const app: FirebaseApp = initializeApp(firebaseOptions)
    this.storage = getStorage(app)
    const gallery: HTMLDivElement = document.getElementById('gallery') as HTMLDivElement
    if (this.$route.params.id) {
      this.fetchPhotoByName(this.$route.params.id as string, gallery)
    } else {
      this.fetchAllPhotos()
    }
    gallery.addEventListener('scroll', this.onGalleryScroll)
    this.onGalleryScroll()
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
    window.addEventListener('click', this.onGlobalClick)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('click', this.onGlobalClick)
    const gallery: HTMLDivElement = (document.getElementById('gallery') as HTMLDivElement)
    gallery.removeEventListener('scroll', this.onGalleryScroll)
  },
  methods: {
    async fetchPhotoByName (name: string, gallery: HTMLDivElement) {
      const photoRef: StorageReference = ref(this.storage, `photography/${name}`)
      const metadataResult: [FullMetadata, string] = await Promise.all([getMetadata(photoRef), getDownloadURL(photoRef)])
      const metadata: FullMetadata = metadataResult[0]
      const largeUrl: string = metadataResult[1]
      this.photos.push(new Photo(metadata.name, '', largeUrl, metadata.customMetadata))
      this.onClickPhoto({ target: gallery.firstChild as HTMLElement } as unknown as MouseEvent, true)
      this.photos.pop()
      this.fetchAllPhotos()
    },
    async fetchAllPhotos () {
      const photoRef: StorageReference = ref(this.storage, 'photography-sm')
      const largePhotoRef: StorageReference = ref(this.storage, 'photography')
      const listResult: [ListResult, ListResult] = await Promise.all([listAll(photoRef), listAll(largePhotoRef)])
      const photoList: ListResult = listResult[0]
      const largePhotoList: ListResult = listResult[1]
      const metadataPromises: Promise<[FullMetadata, string, string]>[] = []
      for (let i = photoList.items.length - 1; i >= 0; i--) {
        // MetadataManager.setMetadata(photoList.items.at(i) as StorageReference)
        metadataPromises.push(Promise.all([getMetadata(photoList.items.at(i) as StorageReference), getDownloadURL(photoList.items.at(i) as StorageReference), getDownloadURL(largePhotoList.items.at(i) as StorageReference)]))
      }
      const metadataResults: [FullMetadata, string, string][] = await Promise.all(metadataPromises)
      for (const metadataResult of metadataResults) {
        this.photos.push(new Photo(metadataResult[0].name, metadataResult[1], metadataResult[2], metadataResult[0].customMetadata))
      }
    },
    onClickCollapse (event: MouseEvent) {
      const targetElement: HTMLElement = event.target as HTMLElement
      targetElement.nextElementSibling?.classList.toggle('active')
      targetElement.classList.toggle('active')
    },
    onClickPhoto (event: MouseEvent | KeyboardEvent, isParam = false) {
      const selectedImage: HTMLImageElement = event.target as HTMLImageElement
      this.currentIndex = isParam ? 0 : Array.from(selectedImage.parentNode?.children ?? []).indexOf(selectedImage)
      this.loadLargePhoto(document.getElementById('currentPhoto') as HTMLImageElement, this.currentIndex, this.showDialog)
      return false
    },
    loadLargePhoto (photoElement: HTMLImageElement, index: number, onload?: () => void) {
      if (onload) {
        photoElement.src = this.photos[index].largeUrl
        photoElement.complete ? onload() : photoElement.onload = onload
      }
      this.currentPhoto = this.photos[index]
    },
    showDialog () {
      const dialog: HTMLDialogElement = document.getElementById('dialog') as HTMLDialogElement
      dialog.addEventListener('keyup', this.dialogKeyHandler)
      dialog.addEventListener('touchstart', this.touchStartHandler)
      dialog.addEventListener('touchend', this.touchEndHandler)
      dialog.addEventListener('close', this.onClickCloseDialog)
      history.pushState({}, '', `/gallery/${this.currentPhoto.name}`)
      dialog.showModal()
      this.setPhotoPosition()
    },
    onClickCloseDialog () {
      this.currentPhoto = new Photo()
      const dialog: HTMLDialogElement = document.getElementById('dialog') as HTMLDialogElement
      dialog.removeEventListener('keyup', this.dialogKeyHandler)
      dialog.removeEventListener('touchstart', this.touchStartHandler)
      dialog.removeEventListener('touchend', this.touchEndHandler)
      dialog.removeEventListener('close', this.onClickCloseDialog)
      dialog.close()
      history.pushState({}, '', '/gallery')
      return false
    },
    onClickSearch () {
      this.togglePopups(1)
    },
    onClickSort () {
      this.togglePopups(2)
    },
    onClickFilter () {
      this.togglePopups(3)
    },
    togglePopups (showPopup: number) {
      const searchPopup: HTMLDivElement = document.getElementById('searchPopup') as HTMLDivElement
      const searchButton: HTMLImageElement = document.getElementById('searchButton') as HTMLImageElement
      const sortPopup: HTMLDivElement = document.getElementById('sortPopup') as HTMLDivElement
      const sortButton: HTMLImageElement = document.getElementById('sortButton') as HTMLImageElement
      const filterPopup: HTMLDivElement = document.getElementById('filterPopup') as HTMLDivElement
      const filterButton: HTMLImageElement = document.getElementById('filterButton') as HTMLImageElement
      if (showPopup === 0) {
        searchPopup.classList.remove('popup-active')
        searchButton.classList.remove('popup-active')
        sortPopup.classList.remove('popup-active')
        sortButton.classList.remove('popup-active')
        filterPopup.classList.remove('popup-active')
        filterButton.classList.remove('popup-active')
      } else if (showPopup === 1) {
        searchPopup.classList.toggle('popup-active')
        searchButton.classList.toggle('popup-active')
        sortPopup.classList.remove('popup-active')
        sortButton.classList.remove('popup-active')
        filterPopup.classList.remove('popup-active')
        filterButton.classList.remove('popup-active')
        const searchField: HTMLInputElement = document.getElementById('searchField') as HTMLInputElement
        searchField.focus()
      } else if (showPopup === 2) {
        sortPopup.classList.toggle('popup-active')
        sortButton.classList.toggle('popup-active')
        searchPopup.classList.remove('popup-active')
        searchButton.classList.remove('popup-active')
        filterPopup.classList.remove('popup-active')
        filterButton.classList.remove('popup-active')
      } else if (showPopup === 3) {
        filterPopup.classList.toggle('popup-active')
        filterButton.classList.toggle('popup-active')
        searchPopup.classList.remove('popup-active')
        searchButton.classList.remove('popup-active')
        sortPopup.classList.remove('popup-active')
        sortButton.classList.remove('popup-active')
      }
    },
    onClickResetSearch () {
      const searchType: HTMLSelectElement = document.getElementById('searchType') as HTMLSelectElement
      searchType.value = 'Type...'
      this.searchTerm = ''
      this.onSearchFieldChanged()
      this.hasSetSearch = false
    },
    onClickResetSort () {
      const sortPopup: HTMLSelectElement = document.getElementById('sortPopup') as HTMLSelectElement
      this.onSortSelected(sortPopup.children[0] as HTMLDivElement)
      this.hasSetSort = false
    },
    onClickResetFilter () {
      const filterPopup: HTMLSelectElement = document.getElementById('filterPopup') as HTMLSelectElement
      for (const child of filterPopup.children) {
        child.classList.add('selected')
      }
      this.onFilterSelected()
      this.hasSetFilter = false
    },
    onSearchFieldChanged: Utilities.debounce(function (this: { onSearchChanged: () => void }) {
      this.onSearchChanged()
    }, 250),
    async onSearchChanged () {
      const searchType: HTMLSelectElement = document.getElementById('searchType') as HTMLSelectElement
      const searchField: HTMLSelectElement = document.getElementById('searchField') as HTMLSelectElement
      if (searchField.value && searchType.value !== 'Type...') {
        this.hasSetSearch = true
        const searchProperty: string = searchType.value.toLowerCase()
        for (const photo of this.photos) {
          photo.matchesSearch = (photo[searchProperty as keyof typeof photo] as string).toLowerCase().includes(searchField.value.toLowerCase())
        }
      } else {
        this.hasSetSearch = false
        for (const photo of this.photos) {
          photo.matchesSearch = true
        }
      }
    },
    async onSortSelected (target: HTMLDivElement) {
      const sortPopup: HTMLDivElement = document.getElementById('sortPopup') as HTMLDivElement
      const oldSelection: HTMLDivElement = sortPopup.getElementsByClassName('selected').item(0) as HTMLDivElement
      if (oldSelection !== target) {
        this.hasSetSort = !this.hasSetSort
        oldSelection.classList.toggle('selected')
        target.classList.toggle('selected')
        this.photos.reverse()
      }
    },
    async onFilterSelected (target?: HTMLDivElement) {
      const filterPopup: HTMLDivElement = document.getElementById('filterPopup') as HTMLDivElement
      target?.classList.toggle('selected')

      const filterStatuses: { wildlife: boolean, landscape: boolean, portrait: boolean, street: boolean, macro: boolean, astro: boolean } = {
        wildlife: false,
        landscape: false,
        portrait: false,
        street: false,
        macro: false,
        astro: false
      }
      for (const child of filterPopup.children) {
        filterStatuses[child.textContent?.toLowerCase() as keyof typeof filterStatuses] = child.classList.contains('selected')
      }
      this.hasSetFilter = !(filterStatuses.wildlife && filterStatuses.landscape && filterStatuses.portrait && filterStatuses.street && filterStatuses.macro && filterStatuses.astro)
      for (const photo of this.photos) {
        const photoTypes: string[] = photo.type.split(',')
        let matchesFilter = false
        for (const photoType of photoTypes) {
          if (filterStatuses[photoType as keyof typeof filterStatuses]) {
            matchesFilter = true
          }
        }
        photo.matchesFilter = matchesFilter
      }
    },
    formatTitle (title: string): string {
      return title?.split('-').join(' ')
    },
    async onClickCopyLink () {
      if (!navigator.clipboard) {
        throw new Error('Browser does not have clipboard support')
      }
      await navigator.clipboard.writeText(window.location.href)
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 500)
      return false
    },
    onClickCloseFullscreen () {
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
    onGlobalClick (event: MouseEvent) {
      const popup: HTMLElement = (event.target as HTMLElement).closest('.popup-active') as HTMLElement
      if (!popup) {
        this.togglePopups(0)
      }
    },
    onWindowResize: Utilities.debounce(function (this: { viewportAspectRatio: number, setPhotoPosition: () => void }) {
      this.viewportAspectRatio = window.innerWidth / window.innerHeight
      this.setPhotoPosition()
    }, 20),
    onGalleryScroll: Utilities.debounce(function (this: { onClickCollapse: (event: MouseEvent) => void }) {
      const gallery: HTMLDivElement = document.getElementById('gallery') as HTMLDivElement
      const galleryHeader: HTMLDivElement = document.getElementById('galleryHeader') as HTMLDivElement
      if (galleryHeader.classList.contains('active') && gallery.scrollTop >= 75) {
        this.onClickCollapse({ target: galleryHeader } as unknown as MouseEvent)
      } else if (!galleryHeader.classList.contains('active') && gallery.scrollTop < 75) {
        this.onClickCollapse({ target: galleryHeader } as unknown as MouseEvent)
      }
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
      nextPhoto.setAttribute('src', this.photos[isPrevious ? this.currentIndex - 1 : this.currentIndex + 1].largeUrl)
      nextPhoto.complete ? this.doTurnPage(isPrevious, nextPhoto) : nextPhoto.onload = () => this.doTurnPage(isPrevious, nextPhoto)
    },
    doTurnPage (isPrevious: boolean, nextPhoto: HTMLImageElement) {
      nextPhoto.onload = null
      const nextPhotoWrapper: HTMLDivElement = document.getElementById(isPrevious ? 'previousPhotoWrapper' : 'nextPhotoWrapper') as HTMLDivElement
      const currentPhoto: HTMLImageElement = document.getElementById('currentPhoto') as HTMLImageElement
      const currentPhotoRect: DOMRect = currentPhoto.getBoundingClientRect()
      const slideTransitionTime = 500
      if (this.isFullscreen) {
        this.loadLargePhoto(nextPhoto, isPrevious ? --this.currentIndex : ++this.currentIndex, this.setPhotoPosition)
        history.pushState({}, '', `/gallery/${this.currentPhoto.name}`)
        return
      }
      this.doSlideTransition(isPrevious, nextPhoto, nextPhotoWrapper, currentPhotoRect, slideTransitionTime)
      setTimeout(() => {
        if (currentPhoto.naturalHeight !== nextPhoto.naturalHeight || currentPhoto.naturalWidth !== nextPhoto.naturalWidth) {
          // Hide buttons and currentPhoto, fix nextPhoto in place, update currentPhoto binding
          this.showButtons = false
          this.setupResizeTransition(currentPhoto, nextPhotoWrapper, currentPhotoRect)
          this.loadLargePhoto(nextPhoto, isPrevious ? --this.currentIndex : ++this.currentIndex)
          requestAnimationFrame(() => {
            this.doResizeTransition(isPrevious, nextPhoto, nextPhotoWrapper, currentPhoto, currentPhotoRect)
          })
        } else {
          this.loadLargePhoto(nextPhoto, isPrevious ? --this.currentIndex : ++this.currentIndex)
          this.resetTransitions(currentPhoto, nextPhoto, nextPhotoWrapper, isPrevious)
        }
        history.pushState({}, '', `/gallery/${this.currentPhoto.name}`)
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
    setupResizeTransition (currentPhoto: HTMLImageElement, nextPhotoWrapper: HTMLDivElement, currentPhotoRect: DOMRect) {
      currentPhoto.style.opacity = '0'
      nextPhotoWrapper.style.position = 'fixed'
      nextPhotoWrapper.style.left = currentPhotoRect.x + 'px'
      nextPhotoWrapper.style.top = currentPhotoRect.y + 'px'
      nextPhotoWrapper.style.width = currentPhotoRect.width + 'px'
      nextPhotoWrapper.style.height = currentPhotoRect.height + 'px'
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
        details.style.inset = `${photoRect.bottom - 15}px auto auto auto`
      } else {
        dialog.style.overflowY = 'scroll'
        details.style.inset = 'calc(100% - 38px) auto auto auto'
      }
    }
  }
})
</script>

<style scoped lang="scss">
@import "@/utilities/constants";
.button-base {
  position: absolute;
  cursor: pointer;
  transition: 0.15s ease-in-out;
}
.gallery-header-content {
  width: 95%;
  padding-left: 2.5%;
  padding-right: 2.5%;
  .search-wrapper, .sort-wrapper, .filter-wrapper {
    position: relative;
    .search-button, .sort-button, .filter-button, .reset-search-button, .reset-sort-button, .reset-filter-button {
      cursor: pointer;
      transition: 0.15s ease-in-out;
      border-radius: 5px;
      transform: scale(0.75, 0.75);
      &.popup-active {
        opacity: 1;
        transform: scale(1, 1);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      @media (hover: hover) {
        opacity: 0.4;
        &:hover {
          opacity: 1;
          transform: scale(1, 1);
        }
        &:active {
          transform: scale(0.75, 0.75);
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
    }
    .reset-search-button, .reset-sort-button, .reset-filter-button {
      position: absolute;
      top: -40px;
      left: 0;
    }
    .search-popup, .sort-popup, .filter-popup {
      position: absolute;
      height: auto;
      top: 40px;
      right: 0;
      z-index: 999;
      border-radius: 5px 0 5px 5px;
      display: none;
      background-color: $popup-background-color;
      &.popup-active {
        display: flex;
      }
    }
    .search-popup {
      .search-field {
        height: 30px;
        margin: 10px;
        text-indent: 5px;
        border-radius: 5px;
        background-color: $header-footer-background-color;
        color: $link-font-color;
        &::placeholder {
          color: $font-color;
        }
      }
      .search-select {
        width: 100px;
        height: 30px;
        margin: 10px 10px 10px 0;
        border-radius: 5px;
        background-color: $header-footer-background-color;
        color: $font-color;
      }
    }
    .sort-popup {
      .sort-item {
        position: relative;
        background-color: $header-footer-background-color;
        color: $font-color;
        text-wrap: nowrap;
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
        margin-left: 35px;
        user-select: none;
        cursor: pointer;
        &.selected:before {
          cursor: auto;
          position: absolute;
          width: 30px;
          height: 30px;
          top: 0;
          left: -32px;
          border-radius: 3px;
          content: '';
          background: url('../assets/selected.png');
          background-size: cover;
        }
      }
    }
    .filter-popup {
      .filter-item {
        position: relative;
        background-color: $header-footer-background-color;
        color: $font-color;
        text-wrap: nowrap;
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
        margin-left: 35px;
        user-select: none;
        cursor: pointer;
        &.selected:before {
          cursor: auto;
          position: absolute;
          width: 30px;
          height: 30px;
          top: 0;
          left: -32px;
          border-radius: 3px;
          content: '';
          background: url('../assets/selected.png');
          background-size: cover;
        }
      }
    }
  }
}
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
}
.photo-dialog {
  height: 90%;
  width: 90%;
  position: relative;
  overflow: hidden;
  place-items: center;
  place-content: center;
  scrollbar-width: thin;
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
    .shop-link {
      color: $selected-font-color !important;
      @media (hover: hover) {
        &:hover {
          color: $header-footer-background-color !important;
        }
        &:active {
          color: $visited-link-font-color !important;
        }
      }
    }
    .photo-title {
      margin: 0;
      text-transform: capitalize;
    }
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
  .fullscreen-button, .close-button, .copy-button {
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
  .copy-button {
    right: 45px;
    padding-top: 1px;
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
  .toast {
    position: absolute;
    top: 4px;
    right: 80px;
    z-index: 999;
    transition: 0.5s;
    color: $selected-font-color;
    font-size: small;
  }
}
#dialog::backdrop {
  background: hsla(0, 0%, 9.41%, 0.50);
  backdrop-filter: blur(5px);
}
</style>
