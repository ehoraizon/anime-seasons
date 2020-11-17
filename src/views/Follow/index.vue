<template>
  <baseApp>
        <ion-content id="follow-content" @ionScrollEnd="savePos" 
                    scrollEvents="true" 
                    class="ion-padding-bottom">
            <renderAnimes v-if="fav.mySavedFavorites.length" :animes="fav.mySavedFavorites" />
            <div v-else class="rabbit">
              <img :src="rabbit"/>
            </div>
        </ion-content>
  </baseApp>
</template>

<script>
import renderAnimes from '@/components/RenderAnimes'
import Restore from '@/store/Restore'
import Cache from '@/store/Cache'
import rabbit from '@/assets/ico_conejo.svg'

export default{
  name: 'follow',
  components:{
    renderAnimes,
  },
  data(){
    return{
      fav: Cache.data,
      rabbit
    }
  },
  methods:{
    savePos(e){
        e.target.getScrollElement()
                .then(el => Restore.methods.Follow.setScrollPos(el.scrollTop))
    },
    timer(handler, time=100){
      setTimeout(handler, time)
    }
  },
  mounted(){
    this.timer(() => document.querySelector('#follow-content')
            .scrollByPoint(0, Restore.data.Follow.scrollPos, 0));

    const fav = Cache.data.favorites.slice();
    if(fav.length){
      Cache.data.mySavedFavorites = Cache.data.mySavedFavorites.slice()
                            .filter(item => fav.includes(item.mal_id))
    }else{
      Cache.data.mySavedFavorites = [];
    }

  }
}
</script>

<style scoped>
</style>
