<template>
  <div>
    <ion-header id="modal-header">
      <ion-toolbar>
        <ion-title slot="start">{{ title }}</ion-title>
        <ion-buttons v-touch:tap="close" slot="end" class="ion-padding-end">
          <ion-icon size="large" name="close"></ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="video-container">
      <iframe v-if="src"
              id="video"
              :src="src" 
              frameborder="0" 
              class="responsive-video"
              scrolling="no"
              allowfullscreen
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" >
      </iframe>
      <p v-show="error" class="sorry ion-margin">
        This is weird. No sources found for this chapter.
      </p>
      <ion-segment 
        v-show="srcs.length" 
        @ionChange="change($event)"
        scrollable="true">
        <ion-segment-button 
          v-for="arr in srcs"
          :key="arr.title"
          :value="arr.title">
          <ion-label>{{arr.title}}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-content>
  </div>
</template>

<script>
import Cache from '@/store/Cache';

export default {
  name: 'modal',
  props: {
    title: { type: String, default: null },
    id: {type: String, default: null},
    url: {type: String, default: null},
    scraper: {type: Function, default: null},
    closeMe: {type: Function, default: null},
  },
  data() {
    return {
      src :'',
      srcs : [],
      error: false,
      stop: null
    }
  },
  methods: {
    close() {
      clearTimeout(this.stop);
      this.closeMe();
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
    change(e){
      const title = e.target.value;
      for(let item of this.srcs){
        if(item.title == title){
          this.src = item.code;
          break
        }
      }
    }
  },
  mounted(){
    const sources = Cache.methods.getSources(this.id, this.title);
    if(sources){
      this.src = sources[0].code;
      this.srcs = sources;
    }else{
      this.loadingData(l => {
        this.scraper.getVideoSources({'url' : this.url})
          .then(res => {
            this.srcs = JSON.parse(res.json);
            this.src = this.srcs[0].code;
            Cache.methods.saveSources(this.id, this.title, this.srcs);
          })
          .catch(() => {
            this.error = true;
          })
          .finally(() => l.dismiss())
      })
    }
    this.stop = setTimeout(() => {
      Cache.methods.saveWatched(this.id, this.title);
    }, 5000*60)
  }
}
</script>

<style scoped>
</style>