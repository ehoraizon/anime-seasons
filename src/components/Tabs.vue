<template>
  <ion-tabs>

    <ion-tab tab="home">
        <ion-vue-router name="home"></ion-vue-router>  
    </ion-tab>

    <ion-tab tab="search">
        <ion-vue-router name="search"></ion-vue-router>
    </ion-tab>

    <ion-tab tab="follow">
        <ion-vue-router name="follow"></ion-vue-router>
    </ion-tab>

    <ion-tab tab="sheduler">
        <ion-vue-router name="sheduler"></ion-vue-router>
    </ion-tab>

    <ion-tab tab="info">
        <ion-vue-router name="info"></ion-vue-router>
    </ion-tab>

    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="home">
        <ion-label>Season</ion-label>
        <ion-icon name="home"></ion-icon>
      </ion-tab-button>
      <ion-tab-button tab="search">
        <ion-label>Explore</ion-label>
        <ion-icon name="compass"></ion-icon>
      </ion-tab-button>
      <ion-tab-button tab="follow">
        <ion-label>Following</ion-label>
        <ion-icon name="heart"></ion-icon>
      </ion-tab-button>
      <ion-tab-button tab="sheduler">
        <ion-label>Today</ion-label>
        <ion-icon name="calendar"></ion-icon>
      </ion-tab-button>
      <ion-tab-button tab="info">
        <ion-label>Info</ion-label>
        <ion-icon name="information-circle-outline"></ion-icon>
      </ion-tab-button>
    </ion-tab-bar>

  </ion-tabs>
</template>

<script>
export default{
  name: 'tabs',
}
</script>