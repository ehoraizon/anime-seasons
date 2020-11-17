<template>
  <div class="card" :class="{'bigger-card': isBigger, 'tiny' : sugest}">
    <div class="wrapper">
      <img  v-touch:tap="goDetails" 
            v-touch:longtap="addToFavorite" 
            v-waves.image.light :src="img"/>
      <div @click="addToFavorite">
        <ion-icon :id="`favorite_${id}`"
                  class="favorite" v-if="isFavorite && animate()"
                  :class="{'hide' : sugest}"
                  name="heart">
        </ion-icon>
        <ion-icon class="favorite" v-else name="heart-empty"
            :class="{'hide' : sugest}">
        </ion-icon>
      </div>
    </div>
  </div>
</template>

<script>
import Cache from '@/store/Cache'

export default{
  name: 'animeCard',
  props:{
    img : {type:String, default:null},
    id : {type:Number, default:null},
    iCanGo : {type:Boolean, default:true},
    isBigger: {type:Boolean, default:false},
    sugest: {type:Boolean, default:false}
  },
  data(){
    const isFavorite = !!Cache.data.favorites.find(id => id == this.id);
    return {
      isFavorite
    }
  },
  methods:{
    timer(handler ,time=500){
      setTimeout(handler,time);
    },
    goDetails(){
      if(this.iCanGo && !this.sugest)
        this.timer(() => this.$router.push(`/anime/${this.id}`));
      else if(this.sugest)
        this.timer(() => 
            this.$router.push(`/anime/${this.id}`)
        );
    },
    animate(){
      this.timer(() => {
        const icon = document.querySelector(`#favorite_${this.id}`);
        icon.classList.add('animated', 'heartBeat', 'faster')
        },
      50);
      this.timer(() => {
        const icon = document.querySelector(`#favorite_${this.id}`);
        icon.classList.remove('animated', 'heartBeat', 'faster')
      });
      return true;
    },
    addToFavorite(){
      if(!this.sugest){
        if(!this.isFavorite){
          this.isFavorite = true;
          Cache.methods.addFavorite(this.id);
        }else{
          this.isFavorite = false;
          Cache.methods.removeFavorite(this.id);
        }
      }
    },
  }
}
</script>