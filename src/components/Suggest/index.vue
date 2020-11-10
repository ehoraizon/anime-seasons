<template>
  <ion-grid class="container-suggest ion-margin-bottom">
    <ion-row class="center-suggest">
      <ion-fab-button id="left"
        class="ion-activatable ripple-parent float"
        @click="addToState(false)">
        <ion-icon name="arrow-round-back"></ion-icon>
        <ion-ripple-effect></ion-ripple-effect>
      </ion-fab-button>

      <anime-card 
        v-for="item in computedList"
        :key="item.mal_id"
        :id="item.mal_id"
        :title="item.title"
        :img="item.image_url"
        :sugest="true"
      />
      
      <ion-fab-button id="right"
        class="ion-activatable ripple-parent float"
        @click="addToState">
        <ion-icon name="arrow-round-forward"></ion-icon>
        <ion-ripple-effect></ion-ripple-effect>
      </ion-fab-button>
    </ion-row>
  </ion-grid>
</template>

<script>
import animeCard from '@/components/RenderAnimes/animeCard';

export default{
  name: 'suggested',
  components:{
    animeCard
  },
  props:{
    recomendation : {type: Array,default:null}
  },
  data(){
    return {
      currentState: 0,
    };
  },
  computed:{
    computedList(){
      return this.recomendation.slice().splice(this.currentState, 3);
    }
  },
  methods:{
    changeStatePos(n){
      if(this.currentState + n == this.recomendation.length)
        return;

      if(this.currentState + n > this.recomendation.length){
        this.changeStatePos(n-1)
      }else this.currentState+=n;
    },
    changeStateNeg(n){
      if(this.currentState + n < 0)
        return;

      this.currentState+=n;
    },
    addToState(pos=true){
      if(pos){
        this.changeStatePos(3);
      }else {
        this.changeStateNeg(-3);
      }
    }
  }
}
</script>

<style scoped>
</style>
