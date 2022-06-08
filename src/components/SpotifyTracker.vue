<template>
  <div>
    <div v-if="isPlaying">
      <span class="block xl:inline">🎸 Playing </span> <br/>
      <span class="block text-indigo-600 xl:inline" :title="song"> {{ song }} by {{ artist }}</span>
    </div>
    <div v-else>
      <span class="block xl:inline">Play Spotify and see 👀 </span>
    </div>
  </div>
</template>

<script>
import * as api from "@/assets/scripts/api"
export default {
  name: "SpotifyTracker",
  mounted() {
    api
      .getUsersCurrentlyPlayingTrack()
      .then((item) => {
        this.isPlaying = true
        this.song = item.name
        this.artist = item.artists[0].name
        this.imgSrc = item.album.images[0].url
      })
      .catch(() => {
        this.isPlaying = false
      })
  },
  data() {
    return {
      isPlaying: false,
      song: "",
      imgSrc: "",
      artist: ""
    }
  },
  methods: {
    navigateToHome() {
      this.$router.push("/")
    }
  }
}
</script>


<style></style>
