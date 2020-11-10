<template>
    <baseApp>
        <ion-toolbar>
            <ion-segment
                :value="currentYear"
                @ionChange="changeYear"
                scrollable>
                <ion-segment-button v-for="(year, i) in years" 
                    :key="i"
                    :value="year">
                    <ion-label>{{year}}</ion-label>
                </ion-segment-button>
            </ion-segment>
        </ion-toolbar>
        <ion-content id="home-content" @ionScrollEnd="savePos" 
                    scrollEvents="true" 
                    class="ion-padding-bottom">
            <ion-fab horizontal="end" vertical="center" slot="fixed">
                <ion-fab-button id="on-top">
                    <ion-icon style="font-size: 3rem" :src="bonny"></ion-icon>
                </ion-fab-button>
                <ion-fab-list side="top">
                    <ion-fab-button @click="changeSeason(2)"
                        :disabled="currentIcon == btnsSeason[2]" 
                        :color="currentIcon == btnsSeason[2] ? 'warning' : 'light'">
                        <ion-icon :name="btnsSeason[2]"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button @click="changeSeason(3)"
                        :disabled="currentIcon == btnsSeason[3]" 
                        :color="currentIcon == btnsSeason[3] ? 'warning' : 'light'">
                        <ion-icon :name="btnsSeason[3]"></ion-icon>
                    </ion-fab-button>
                </ion-fab-list>
                <ion-fab-list side="bottom">
                    <ion-fab-button @click="changeSeason(0)"
                        :disabled="currentIcon == btnsSeason[0]" 
                        :color="currentIcon == btnsSeason[0] ? 'warning' : 'light'">
                        <ion-icon :name="btnsSeason[0]"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button @click="changeSeason(1)"
                        :disabled="currentIcon == btnsSeason[1]" 
                        :color="currentIcon == btnsSeason[1] ? 'warning' : 'light'">
                        <ion-icon :name="btnsSeason[1]"></ion-icon>
                    </ion-fab-button>
                </ion-fab-list>
            </ion-fab>
            <renderAnimes :animes="ans.anime" />
        </ion-content>
    </baseApp>
</template> 

<script>
import renderAnimes from '@/components/RenderAnimes'
import Cache from '@/store/Cache'
import Restore from '@/store/Restore'
import bonny from '@/assets/bonny.svg'

export default{
  name: 'home',
  components:{
      renderAnimes
  },
  data() {
      const currentYear =  Restore.data.Home.currentYear;
      const years = (()=> {
          const years = [new Date().getFullYear()];
          for(let i = 1; i < Cache.data.yearsMax; i++){
              years.push(years[0] - i);
          }
          return years;
      })();
      return {
          ans : 'NONE',
          currentYear,
          years,
          btnsSeason: ['snow', 'flower', 'sunny', 'leaf'],
          seasons: ['winter', 'spring', 'summer', 'fall'],
          currentIndex:  Restore.data.Home.currentIndex,
          bonny,
      }
  },
  computed:{
      currentIcon(){
          return this.btnsSeason[this.currentIndex];
      },
      currentSeason(){
          return this.seasons[this.currentIndex];
      }
  },
  methods:{
    savePos(e){
        e.target.getScrollElement()
                .then(el => Restore.methods.Home.setScrollPos(el.scrollTop))
    },
    changeYear(event){
        this.currentYear = event.target.value;
        Restore.methods.Home.setCurrentYear(this.currentYear);
        this.loadingData(this.makeRequest);
    },
    changeSeason(i){
        Restore.methods.Home.setCurrentIndex(i)
        this.currentIndex = i;
        this.loadingData(this.makeRequest);
    },
    timer(handler, time=100){
        setTimeout(handler, time);
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    makeRequest(loading){
        const hasBenCached = Cache.data.seasons[this.years[0] - this.currentYear][this.currentIndex];
        if(hasBenCached){
            this.ans = hasBenCached;
            setTimeout(() => loading.dismiss(), 100);
            this.timer(() => document.querySelector('#home-content')
                        .scrollToTop(1000))
        }else{
        fetch(`${window.url}/season/${this.currentYear}/${this.currentSeason}`)
                .then(res => res.json())
                .then(res => {
                    this.ans = res;
                    loading.dismiss();
                    this.timer(() => document.querySelector('#home-content')
                        .scrollToTop(1000))
                    Cache.methods.saveSeason(res, [this.years[0] - this.currentYear, this.currentIndex]);
                })
        }
    },
    loadingData(callBack){
      return this.$ionic.loadingController
        .create({
          message: 'Loading ...',
        })
        .then(l => {
          callBack(l);
          return l.present()
        })
    },
  },
  mounted(){
    this.timer(async () => {
        while(!document.querySelector('#on-top')
                .shadowRoot.querySelector('button')){
            await this.sleep(100)
        }
        document.querySelector('#on-top')
                .shadowRoot.querySelector('button').style.zIndex = '2';
    });
    const hasBenCached = Cache.data.seasons[this.years[0] - this.currentYear][this.currentIndex];
    if(hasBenCached){
        this.ans = hasBenCached;
        this.timer(() => document.querySelector('#home-content')
                            .scrollByPoint(0, Restore.data.Home.scrollPos, 0))
    }else{
        fetch(`${window.url}/season/${this.currentYear}/${this.currentSeason}`)
                .then(res => res.json())
                .then(res => {
                    this.ans = res;
                    this.timer(() => document.querySelector('#home-content')
                            .scrollByPoint(0, Restore.data.Home.scrollPos, 0))
                    Cache.methods.saveSeason(res, [this.years[0] - this.currentYear, this.currentIndex]);
                })
    }
  },
}
</script>