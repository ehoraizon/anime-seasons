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
window.secondUrl = "https://animeflv.ru/animes/buscar/?nombre=" //"https://animeflv.net/browse?q="
window.thirdUrl = "https://vrv.co/?q="
window.hUrl1 = "https://hentaihaven.red/?s="
window.hUrl2 = "https://tiohentai.com/directorio?q="


import Grid from 'vue-js-grid'

Vue.use(Grid)

import { Plugins } from '@capacitor/core';

const { Clipboard, 
        Network,
        Storage,
        PushNotifications,
        AnimeFLVScraper,
        Share, 
        CapacitorRateApp,
         } = Plugins;

import { SocialSharing } from '@ionic-native/social-sharing';
import { LocalNotifications } from '@ionic-native/local-notifications';

PushNotifications.addListener('registration', 
(token) => {
        const save = async function(token){
          const resKeys = await Storage.keys();
          if(!resKeys.includes('token')){
            Storage.set({
              key: 'token',
              value: JSON.stringify(token)
            });
          }
        };
        save(token);
    }
);

(async function(){await PushNotifications.register()})();

window.PushNotifications = PushNotifications;

window.CapClipboard = Clipboard;
window.CapNetwork = Network;
window.CapacitorRateApp = CapacitorRateApp
window.SocialSharing = SocialSharing;
window.LocalNotifications = LocalNotifications;
window.PLocalNotifications = Plugins.LocalNotifications;

window.AnimeFLVScraper = AnimeFLVScraper;

async function setItem(db, key){
  await Storage.set({
    key,
    value: JSON.stringify(db)
  });
}

window.addToChannel = (id, name) => {
  PushNotifications.createChannel({
    id,
    name
  })
}

window.removeFromChannel = (id, name) => {
  PushNotifications.deleteChannel({
    id,
    name
  })
}

window.removeFromChannel 
window.setItem = setItem;
window.storage = Storage;
window.share = Share;

const key = 'fav';
window.key = key;

import Cache from '@/store/Cache'

(async function(){
  const res = await Storage.keys();
  console.log(res)
  if(!res.keys.includes(key)){
    await window.setItem([], key);
  }else{
    Storage.get({key})
           .then(res => {
            const favorites = JSON.parse(res.value);
            for(let i of favorites){
              Cache.methods.addFavorite(i);
            }
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