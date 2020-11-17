<template>
    <baseApp>
      <ion-content padding>
        <ion-list>
          <ion-item @click="share" button="true" lines="none">
            <ion-icon slot="start" name="share"></ion-icon>
            <ion-label> Share </ion-label>
          </ion-item>
          <ion-item @click="rate" button="true" lines="none">
            <ion-icon slot="start" name="star-half"></ion-icon>
            <ion-label> Rate app </ion-label>
          </ion-item>
          <ion-item @click="toggle(0)" button="true" lines="none">
            <ion-icon slot="start" name="help"></ion-icon>
            <ion-label>About</ion-label>
          </ion-item>
          <ion-radio-group :value="language" @ionChange="updateLanguage">
            <ion-item>
              <ion-label>Spanish</ion-label>
              <ion-radio slot="start" value="es"></ion-radio>
            </ion-item>
            <ion-item>
              <ion-label>English</ion-label>
              <ion-radio slot="start" value="en"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
        <p class="toggle-content">
          This application has been created for Japanese culture lovers.
          If you like it, please share and rate it. Any questions or suggestions can be sent to
          <strong>appworld_@outlook.com</strong>. 
          <br /><br /> The information and videos on this app are not our property 
          and are not hosted or stored in servers of our own. If the episodes of an anime are not 
          found you can access the trailer and two external links that are provided. You can
          also copy the anime title to the clipboard
          (it is possible that some of the anime is not found in any given link).
          <br /><br /> There is more to come. 😉
        </p>
      </ion-content>
    </baseApp>
</template>

<script>
import Options from '@/store/Options';

export default{
  name: 'info',
  data(){
    return {
      language : Options.data.lang
    }
  },
  methods:{
    toggle(n){
      const targets = document.querySelectorAll('.toggle-content');

      targets[n].classList.toggle('display-block')
      setTimeout(() => targets[n].classList.toggle('show'), 100)
    },
    share(){
      window.share.share({
        title: 'Incedible app',
        text: 'All animes in one place',
        url: window.appUrl,
        dialogTitle: 'Share with your friends and family'
      });
    },
    rate(){
      window.CapacitorRateApp.requestReview();
    },
    updateLanguage(e){
      this.language = e.target.value;
      Options.methods.changeLanguage(this.language);
    }
  }
}
</script>
