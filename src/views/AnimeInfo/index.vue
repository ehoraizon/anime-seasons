<template>
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/"></ion-back-button>
        </ion-buttons>
        <ion-title style="font-weight: 600">{{anime.title}}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid class="ion-padding-top">
        <ion-row>
          <ion-col size="6" class="center-col">
            <animeCard :iCanGo="false" 
                      :img="anime.image_url" 
                      :id="anime.mal_id"
                      :isBigger="true"/>
          </ion-col>
          <ion-col class="fab-container" size="6">
            <ion-item v-if="anime.score" class="info-text" lines="none">
              <ion-label>Score: </ion-label>
              <ion-badge color="danger">{{anime.score}}</ion-badge>
            </ion-item>
            <ion-item v-if="anime.episodes" class="info-text" lines="none">
              <ion-label>Episodes:</ion-label>
              <ion-badge color="success">{{anime.episodes}}</ion-badge>
            </ion-item>
            <ion-item v-if="anime.rank" class="info-text" lines="none">
              <ion-label>Rank:</ion-label>
              <ion-badge color="success">{{anime.rank}}</ion-badge>
            </ion-item>
            <ion-item v-if="anime.status" class="info-text" lines="none">
              <ion-badge color="success">{{anime.status}}</ion-badge>
            </ion-item>
            <ion-fab-button class="fab-share" @click="share" color="purple">
              <ion-icon color="green" name="share"></ion-icon>
            </ion-fab-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <div style="padding: 28px 20px 0px;">
        <ion-chip v-for="(genre ,i) in anime.genres"
          :key="i">
          <ion-label>{{genre.name}}</ion-label>
        </ion-chip>
      </div>
      <h5 v-if="anime.synopsis" 
          style="font-weight: 600; padding: 0 24px">
      Synopsis:</h5>
      <transition name="anime-text" 
                  enter-active-class="animated fadeIn faster">
        <p v-if="showAllText" v-touch:tap="toggleText" 
          class="big-text ion-text-justify"
          style="padding: 0 24px"
          key="bigtext">
          {{anime.synopsis}}
        </p>
        <p v-else v-touch:tap="toggleText" 
          class="big-text ion-text-justify"
          style="padding: 0 24px"
          key="smalltext">
          {{smallText}}
        </p>
      </transition>
      <div v-if="fallback" class="center" style="margin-left: 24px">
        <ion-button :disabled="isNotNormalAnime || !src" 
                    v-touch:tap="goYoutube" 
                    class="ion-activatable ripple-parent" 
                    color="primary">
          <ion-icon name="eye"></ion-icon> 
          <span style="padding-left: 4px"> Trailer </span>
          <ion-ripple-effect></ion-ripple-effect> 
        </ion-button>
        <ion-button :disabled="anime.status == 'Not yet aired'" 
                    v-touch:tap="linkAlert"
                    class="ion-activatable ripple-parent ion-margin-start"
                    color="primary">
          <ion-icon name="link"></ion-icon>
          <span style="padding-left: 4px"> Watch </span>
          <ion-ripple-effect></ion-ripple-effect>
        </ion-button>
      </div>
      <ion-list v-show="animeEpisodes.length" inset="true" lines="inset">
        <ion-list-header style="padding: 0 8px">
          <h5 style="font-weight: 600">
            Episodes:
          </h5>
        </ion-list-header>
        <ion-item 
          v-for="episode in animeEpisodes" 
          :key="episode[2]"
          @click="openModal($event, episode[0], episode[2])">
          <ion-thumbnail slot="start">
            <img :src="!!episode[1] ? episode[1] : anime.image_url">
          </ion-thumbnail>
          <ion-label>{{episode[2]}}</ion-label>
          <ion-icon v-if="watched.includes(episode[2])" name="eye" color="primary"></ion-icon>
          <ion-icon v-else name="eye-off"></ion-icon>
        </ion-item>
      </ion-list>
      <h5 v-if="sugest.length" 
          style="font-weight: 600; padding: 0 24px">
      Suggestions:</h5>
      <suggested v-if="sugest.length" :recomendation="sugest"/>

    </ion-content>
  </ion-app>
</template>

<script>
import Cache from '@/store/Cache'
import Options from '@/store/Options'
import animeCard from '@/components/RenderAnimes/animeCard'
import suggested from '@/components/Suggest'

export default{
  name: 'animeInfo',
  props:{
    id : {type:String, default:null},
  },
  components:{
    animeCard,
    suggested,
  },
  data(){
    return{
      anime : {
        synopsis: ''
      },
      smallText : '',
      showAllText: false,
      isNotNormalAnime: false,
      fail: false,
      src: '',
      goFunction: 0,
      sugest : '',
      animeEpisodes : [],
      fallback : false,
      watched : [],
    }
  },
  watch:{
    '$route': function(){
        this.load();
    }
  },
  methods:{
    share(){

      const options = {
        message: `All your animes in one app : ${this.anime.title} \n`, // not supported on some apps (Facebook, Instagram)
        subject: `You can find ${this.anime.title} in Anime Seasons \n`, // fi. for email
        files: [this.anime.image_url], // an array of filenames either locally or remotely
        url: window.appUrl,
        chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
      };

      window.SocialSharing.shareWithOptions(options, () => {}, () => {});
    },
    clearName(name){
      return name.replace('Anime Edition', '')
    },
    btnFunctions(i){
      switch(i){
        case 1:
          !this.isNotNormalAnime
                ? window.open(`${window.secondUrl}${this.clearName(this.anime.title).split(' ').join('+')}`, "_blank")
                : window.open(`${window.hUrl1}${this.clearName(this.anime.title).split(' ').join('+')}`, "_blank");
          break;
        case 2:
          !this.isNotNormalAnime 
                ? window.open(`${window.thirdUrl}${this.clearName(this.anime.title).split(' ').join('+')}`, "_blank")
                : window.open(`${window.hUrl2}${this.clearName(this.anime.title).split(' ').join('+')}`, "_blank");
          break;
        case 3:
          window.CapClipboard.write({
            string: this.clearName(this.anime.title)
          });
          this.openToast();
          break;
        default:
          break;
      }
    },
    goButtons(){
      const buttons = [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: !this.isNotNormalAnime ? 'Go AnimeFLV' : 'Go HentaiHaven',
          role: 'accept',
          cssClass: 'secondary',
          handler: () => {
            this.goFunction = 1;
            this.btnFunctions(this.goFunction);
          }
        },
        {
          text: !this.isNotNormalAnime ? 'Go KissAnimeFree' : 'Go Tio Hentai',
          role: 'accept',
          cssClass: 'secondary',
          handler: () => {
            this.goFunction = 2;
            this.btnFunctions(this.goFunction);
          }
        },
        {
          text: 'Copy to Search',
          role: 'accept',
          cssClass: 'secondary',
          handler: () => {
            this.goFunction = 3;
            this.btnFunctions(this.goFunction);
          }
        } 
      ];
      return buttons;
    },
    toggleText(){
      if(this.smallText != this.anime.synopsis)
        this.showAllText = !this.showAllText;
    },
    findNotAllow(aGenres){
      for(let item of aGenres){
        if(item.name == "Hentai")
          return true;
      }
      return false;
    },
    makeShortText(){
      this.smallText = this.anime.synopsis.length > 78 
                      ? `${this.anime.synopsis.slice(0,78)}...`
                      : this.anime.synopsis
    },
    goYoutube(){
        window.open(`${this.src}`, "_blank")
    },
    linkAlert() {
      return this.$ionic.alertController
        .create({
          header: 'Watch episodes',
          message: `Click <strong>Go</strong> to see the anime 
                    or click <strong>Copy</strong> to search on web`,
          buttons: this.goButtons()
        })
        .then(a => a.present())
    },
    openToast(){
      return this.$ionic.toastController
        .create({
          color: 'dark',
          duration: 2000,
          message: 'Copied to Clipboard',
          showCloseButton: true
        })
        .then(a => a.present())
    },
    loadingData(callBack){
      return this.$ionic.loadingController
        .create({
          message: 'Loading Anime',
        })
        .then(l => {
          callBack(l);
          return l.present()
        })
    },
    loadSuggest(loading=null){
      const sugest = Cache.methods.getSugest(Number.parseInt(this.id));
      if(sugest){
        this.sugest = sugest.sugest;
      }else{
        const fetchSugest = (l) => {
          fetch(`${window.url}/anime/${this.id}/recommendations`)
            .then(res => res.json())
            .then(res => {
              this.sugest = res.recommendations;
              Cache.methods.saveSugest(Number.parseInt(this.id), this.sugest);
              l.dismiss();
            })
        }
        if(loading)
          fetchSugest(loading);
        else this.loadingData(fetchSugest);
      }
    },
    loadEpisodes(loading=null){
      const scraper = this.scraper();

      // ADD TO CACHE
      const saveInCache = urlThumbsInd => {
        Cache.methods.saveEpisodes(this.id, urlThumbsInd);
      };

      // Fall back
      const fback = () => {
        this.fallback = true;
      }

      const sleep = () => {
        if(this.anime.title == undefined)
          setTimeout(sleep, 1000)
        else{
          scraper.searchAnime({'anime' : this.anime.title})
            .then(res => {
              scraper.getAnimeEpisodes({'url' : res.url})
                .then( res2 => {
                  const animeEpisodes = JSON.parse(res2.urlThumbsInd);
                  this.animeEpisodes = animeEpisodes.map(item => {
                    item[1] = item[1] ? `data:image/jpg;base64,${item[1]}` : '';
                    return item;
                  });
                  setTimeout(() => {saveInCache(this.animeEpisodes)} , 1000);
                  if(loading)
                    this.loadSuggest(loading);
                })
                .catch(() => {
                  setTimeout(fback, 1000);
                  if(loading)
                    this.loadSuggest(loading);
                })
            })
            .catch(() => {
              setTimeout(fback, 1000)
              if(loading)
                this.loadSuggest(loading);
            })
        }
      }

      if(loading){
        this.watched = Cache.methods.getWatched(this.id);
        sleep();
      }else{
        this.watched = Cache.methods.getWatched(this.id);
        const cache = Cache.methods.getEpisodes(this.id);
        if(cache){
          this.animeEpisodes = cache;
        }
        else sleep();
      }
    },
    load(){
      const cachedAnime = Cache.methods.getAnime(Number.parseInt(this.id));
      if(cachedAnime){
        this.anime = cachedAnime;
        if(this.anime.synopsis)
          this.makeShortText();
        this.loadEpisodes();
        this.loadSuggest();
      }else{
        this.loadingData((loading) =>
          fetch(`${window.url}/anime/${this.id}`)
              .then(res => res.json())
              .then(res => {
                this.anime = res;
                Cache.methods.saveAnime(this.anime);
                if(this.anime.synopsis)
                  this.makeShortText();
                const genres = this.anime.genres.slice();
                if(this.findNotAllow(genres))
                  this.isNotNormalAnime = true;
                this.loadEpisodes(loading);
              })
        )
      }

      const video = Cache.methods.getVideo(Number.parseInt(this.id));
      if(video){
        this.src = video.promo;
      }else{
        fetch(`${window.url}/anime/${this.id}/videos`)
            .then(res => res.json())
            .then(res => {
              this.src = res.promo[0].video_url;
              Cache.methods.saveVideo({
                promo: res.promo[0].video_url,
                id: Number.parseInt(this.id)
              });
            })
            .catch(() => {
              this.isNotNormalAnime = true;
            })
      }
    },
    scraper(){
      return Options.data.lang == 'es' 
          ? window.AnimeFLVScraper : window.KissAnimeScraper
    },
    openModal(e, url, n) {
      return this.$ionic.modalController
        .create({
          component: () => import('@/components/Modal'),
          componentProps: {
            parent: this,
            propsData: {
              id: this.id,
              title: n,
              url,
              scraper : this.scraper(),
              closeMe: () => {
                this.$ionic.modalController.dismiss()
              },
            },
          },
        })
        .then(m => m.present())
    },
  },
  mounted(){
    this.load();
  }
}
</script>
