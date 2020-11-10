<template>
    <baseApp>
        <ion-content id="sheduler-content" @ionScrollEnd="savePos" 
                    scrollEvents="true" 
                    class="ion-padding-bottom">
            <renderAnimes v-if="day.length" :animes="day" />
        </ion-content>
    </baseApp>
</template> 

<script>
import renderAnimes from '@/components/RenderAnimes'
import Cache from '@/store/Cache'
import Restore from '@/store/Restore'

export default{
  name: 'sheduler',
  components:{
      renderAnimes
  },
  data() {
      return {
        days : ['sunday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'monday'],
        day : [],
      }
  },
  methods:{
    savePos(e){
        e.target.getScrollElement()
                .then(el => Restore.methods.Sheduler.setScrollPos(el.scrollTop))
    },
    getTheDay(){
        return new Date().getDay();
    },
    timer(handler, time=100){
        setTimeout(handler, time);
    },
    loadingData(callBack){
      return this.$ionic.loadingController
        .create({
          message: 'Loading Animes',
        })
        .then(l => {
          callBack(l);
          return l.present()
        })
    },
  },
  mounted(){
    if(Cache.data.sheduler.length){
        this.day = Cache.data.sheduler;
        this.timer(() => document.querySelector('#sheduler-content')
                            .scrollByPoint(0, Restore.data.Sheduler.scrollPos, 0));
    }else{
        this.loadingData(loading => {
          fetch(`${window.url}/schedule/${this.days[this.getTheDay()]}`)
                .then(res => res.json())
                .then(res => {
                    this.day = res[this.days[this.getTheDay()]];
                    this.timer(() => document.querySelector('#sheduler-content')
                            .scrollByPoint(0, Restore.data.Sheduler.scrollPos, 0))
                    Cache.methods.saveSheduler(this.day);
                    loading.dismiss();
                });
        });
    }
  },
}
</script>