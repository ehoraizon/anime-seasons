// npm install ionicons@4.5.9-1 use this for no errors
// window.skipLocalNotificationReady = true
// Base dependencies
import Vue from 'vue'
import App from "./App.vue";
import IonicVue from '@ionic/vue';
import router from '@/router'

// Ionic core styles
import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'

//My imports
import 'animate.css/animate.min.css'
import './assets/scss/main.scss'

import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents)

import BaseApp from '@/components/BaseApp'

Vue.component('baseApp', BaseApp)
Vue.use(IonicVue)

window.appUrl = "https://play.google.com/store/apps/details?id=com.appworld.anime_seasons"
window.url = "https://api.jikan.moe/v3"
window.secondUrl = "https://animeflv.net/animes/buscar/?nombre=" //"https://animeflv.net/browse?q="
window.thirdUrl = "https://kissanimefree.net/?s="
window.hUrl1 = "https://hentaihaven.red/?s="
window.hUrl2 = "https://tiohentai.com/directorio?q="

import Grid from 'vue-js-grid'

Vue.use(Grid)

import { Plugins } from '@capacitor/core';

const { Clipboard, 
        Network,
        Storage,
        AnimeFLVScraper,
        KissAnimeScraper,
        Share, 
        CapacitorRateApp,
        LocalNotifications,
        SplashScreen
         } = Plugins;

import { SocialSharing } from '@ionic-native/social-sharing';

window.CapClipboard = Clipboard;
window.CapNetwork = Network;
window.CapacitorRateApp = CapacitorRateApp
window.SocialSharing = SocialSharing;
window.LocalNotifications = LocalNotifications;
window.SplashScreen = SplashScreen;

window.AnimeFLVScraper = AnimeFLVScraper;
window.KissAnimeScraper = KissAnimeScraper;

async function setItem(db, key){
  await Storage.set({
    key,
    value: JSON.stringify(db)
  });
}

window.removeFromChannel 
window.setItem = setItem;
window.storage = Storage;
window.share = Share;

const key = 'fav';
const options = 'con';
const watched = 'wtd';
window.watched = watched;
window.options = options;
window.key = key;

import Cache from '@/store/Cache'
import Options from '@/store/Options'

(async function(){
  const res = await Storage.keys();
  if(!res.keys.includes(key)){
    await window.setItem([], key);
  }else{
    Storage.get({key})
      .then(res => {
        const favorites = JSON.parse(res.value);
        Cache.data.favorites = favorites;
      })
  }
  if(!res.keys.includes(options)){
    await window.setItem(Options.data, options);
  }else{
    Storage.get({key: options})
      .then(res => {
        const data = JSON.parse(res.value);
        Options.data = data;
      })
  }
  if(!res.keys.includes(watched)){
    await window.setItem([], watched);
  }else{
    Storage.get({key: watched})
      .then(res => {
        const data = JSON.parse(res.value);
        Cache.data.animeEpisodes.watched = data;
      })
  }
})()

import MagicGrid from 'vue-magic-grid'
Vue.use(MagicGrid)

import Waves from 'vue-waves-effect';
import 'vue-waves-effect/dist/vueWavesEffect.css';

Vue.use(Waves);

// Create a new Vue instance
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')