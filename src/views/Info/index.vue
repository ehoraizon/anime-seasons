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
        </ion-list>
        <p class="toggle-content">
          This application has been created by and for Japanese culture lovers.
          If you like it, please share and rate it. Any questions or suggestions can be sent to
          <strong>appworld_@outlook.com</strong>. 
          <br /><br /> About the videos: They are not downloaded or viewed directly on the app,
          you must use the links provided to view the videos at your own responsibility.
          It is possible that some of the anime is not found in any given link,
          in that case you can copy the name and search it on the web.
          <br /><br /> There is more to come. 😉
        </p>
      </ion-content>
    </baseApp>
</template>

<script>
export default{
  name: 'info',
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
    }
  }
}
</script>
