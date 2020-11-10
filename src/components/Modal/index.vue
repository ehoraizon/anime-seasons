<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title slot="start">{{ title }}</ion-title>
        <ion-buttons v-touch:tap="close" slot="end" class="ion-padding-end">
          <ion-icon size="large" name="close"></ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="video-container">
      <iframe v-if="src"
              id="video" width="560" height="315" 
              :src="src" 
              frameborder="0" 
              class="responsive-video"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" >
      </iframe>
      <p v-show="error" class="sorry">
        There is not a promo video for this anime
      </p>
    </ion-content>
  </div>
</template>

<script>
import Cache from '@/store/Cache';

export default {
  name: 'modal',
  props: {
    title: { type: String, default: 'Trailer' },
    id: {type: Number, default: null},
  },
  data() {
    return {
      src :'',
      error: false
    }
  },
  methods: {
    close() {
      console.log('closing')
      this.$parent.$emit('close', { foo: 'bar' })
    },
    loadingData(callBack, message='Loading Details'){
      return this.$ionic.loadingController
        .create({
          message
        })
        .then(l => {
          callBack(l);
          return l.present()
        })
    },
  },
  mounted(){
    const video = Cache.methods.getVideo(Number.parseInt(this.id));
    if(video)
      this.src = video.promo;
    else{
      this.loadingData(l => fetch(`${window.url}/anime/${this.id}/videos`)
           .then(res => res.json())
           .then(res => {
             this.src = res.promo[0].video_url;
             Cache.methods.saveVideo({promo: res.promo[0].video_url});
           })
           .catch(err => {
             console.log(err);
             this.error = true;
           })
           .finally(() => l.dismiss()), 'Looking for Promo')
    }
  }
}
</script>

<style scoped>
</style>