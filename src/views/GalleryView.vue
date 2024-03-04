<template>
  <div class="flex-dynamic flex-container flex-column width-full">
    <h1 class="flex-static">Gallery</h1>
    <!-- TODO: add lazy-loading using intersectionObserver -->
    <div class="flex-container flex-row flex-wrap flex-gap">
      <!-- TODO: create photo tile element and click to fullscreen function -->
      <!-- TODO: dynamically downscale images to save bandwidth -->
      <!-- TODO: dynamically add watermarks? -->
      <img v-for="photo in photos" :key="photo.url" class="flex-static image-loaded" height="400" width="400" onload="this.style.opacity=1" :title="photo.name" :alt="photo.name" :src="photo.url"/>
    </div>
  </div>
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
      photos: new Array<{ url: string, name: string, description: string }>()
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
    })
  }
})
</script>

<style scoped lang="scss">
.image-loaded {
  opacity: 0;
  transition: 1.5s;
  min-width: 400px;
}
</style>
