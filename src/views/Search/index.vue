<template>
    <baseApp>
        <ion-content id="search-content" @ionScrollEnd="savePos" 
                    scrollEvents="true"
                    class="ion-padding-top">

            <ion-refresher slot="fixed" @ionRefresh="zero">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <ion-row class="ion-padding-start ion-padding-end">
                <ion-col size="10" style="padding: 5px 0">   
                    <ion-searchbar
                    style="padding: 5px 10px 5px 0;"
                    animated="true"
                    type="text"
                    :value="searchInput"
                    @ionInput="inputChange($event)"
                    />
                </ion-col>
                <ion-col size="2" class="center-col">
                    <ion-button v-touch:tap="btnSearch"  style="margin:0"
                                color="warning"
                                :disabled="thereIsData">
                        <ion-icon color="primary" :name="searchIcon"></ion-icon>
                    </ion-button>
                </ion-col>
            </ion-row>
            <div class="container">
                <!-- <div class="content-slide">
                    <ion-chip v-for="(type ,i) in types"
                        @click="toggleType(type)"
                        :color="selectedType == type ? 'success' : ''"
                        :id="type"
                        :key="i">
                        <ion-label>{{type}}</ion-label>
                    </ion-chip>
                </div> -->
                <div class="content-slide ion-margin-start ion-margin-end">
                    <ion-chip v-for="(genre ,i) in genres"
                        :id="`filter_${i}`"
                        :key="`filter_${i}`">
                        <ion-label @click="addFilter(i)">{{genre}}</ion-label>
                        <ion-icon @click="removeFilter(i)" 
                                  v-if="activeFilters.includes(i)" 
                                  name="close-circle">
                        </ion-icon>
                    </ion-chip>
                </div>
            </div>
            <renderAnimes class="design-margin" 
                          v-if="searchResult"
                          :animes="searchResult" />

            <ion-infinite-scroll @ionInfinite="loadMore" :disabled="fullFilled"
                                 threshold="100px" position="bottom">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
        </ion-content>
    </baseApp>
</template>

<script>
import renderAnimes from '@/components/RenderAnimes'
import Restore from '@/store/Restore'

export default{
  name: 'search',
  components:{
    renderAnimes  
  },
  data() {
      return {
          searchInput: '',
          searchResult: [],
          selectedType: 'anime',
          activeFilters : [],
          saveFilters :  Restore.data.Search.saveFilters,
          url: '',
          cacheUrl: Restore.data.Search.cacheUrl,
          fullFilled: Restore.data.Search.fullFilled,
          page: Restore.data.Search.page,
          searchIcon: '',
          types : ['anime', 'character'],
          genres : ["Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons",
                    "Mystery", "Drama", "Ecchi", "Fantasy", "Game", "Hentai", "Historical",
                    "Horror","Kids", "Magic", "Martial Arts", "Mecha", "Music",
                    "Parody", "Samurai", "Romance", "School", "Sci Fi", "Shoujo",
                    "Shoujo Ai", "Shounen", "Shounen Ai:", "Space", "Sports",
                    "Super Power", "Vampire", "Yaoi", "Yuri", "Harem", "Slice Of Life",
                    "Supernatural", "Military", "Police", "Psychological", "Thriller", "Seinen", "Josei"]
      }
  },
  computed:{
    thereIsData(){
        return !(this.searchInput.length > 2 || !!this.activeFilters.length);
    }
  },
  methods:{
    zero(e){
        Restore.data.Search.searchInput = this.searchInput = '';
        Restore.data.Search.searchResult = this.searchResult = '';
        Restore.data.Search.fullFilled = this.fullFilled =  true;
        Restore.data.Search.page = this.page = 0;
        Restore.data.Search.cacheUrl = this.cacheUrl = '';
        Restore.data.Search.saveFilters = this.saveFilters = [];
        this.url = '';

        if(Restore.data.Search.activeFilters.length){
            Restore.data.Search.activeFilters.forEach(i => {
                this.removeFilter(i);
            })
            Restore.data.Search.activeFilters = this.activeFilters = [];
        }
       

        if(Restore.data.Search.searchCache.length &&
            Restore.data.Search.top){
            this.searchResult = Restore.data.Search.searchCache;
            e.target.complete();
        }else{
            fetch(window.url + '/top/anime')
                .then(res => res.json())
                .then(res => {
                    this.searchResult = res.top;
                    Restore.methods.Search.setSearchCache(this.searchResult);
                })
                .then(() => {
                    this.fullFilled = true;
                    e.target.complete();
                })
        }
        Restore.data.Search.top = true;
    },
    savePos(e){
        e.target.getScrollElement()
                .then(el => Restore.methods.Search.setScrollPos(el.scrollTop))
    },
    loadMore(event){
        this.search(event);  
    },
    callAPI(event, l){
        return fetch(this.url).then(res => res.json())
            .then(res => {
                if(this.url.replace(`page=${this.page}`, '') 
                    == this.cacheUrl.replace(`page=${this.page-1}`, '')){
                    if(res.results.length)
                        this.searchResult = this.searchResult.slice().concat(res.results)
                else this.fullFilled = true;
                }
                else{
                    this.fullFilled = !event.target.complete ? false : this.fullFilled;
                    this.searchResult = res.results;
                    this.page = this.cacheUrl ? 0 : this.page ;
                }

                this.cacheUrl = this.url;
                if(event.target.complete)
                    event.target.complete()
                Restore.methods.Search.setSearchCache(this.searchResult.slice());
                Restore.methods.Search.setFullFilled(this.fullFilled);
                Restore.methods.Search.setPage(this.page);
                Restore.methods.Search.setCacheUrl(this.cacheUrl);
            })
            .catch(e => console.error(e))
            .finally(() => {if(l) l.dismiss()})
    },
    addGenresQuery(){
        this.saveFilters.forEach(i => {
            this.url+= '&genre=' + (i+1);
        });
    },
    search(event, l=null){
        this.url = window.url + `/search/anime?page=${++this.page}`;
        if(this.searchInput){
            this.url += `&q=${this.searchInput.split(' ').join('%')}`;
            Restore.methods.Search.setSearchInput(this.searchInput);
        }
        this.addGenresQuery()
        if(this.activeFilters.length)
            Restore.methods.Search.setActiveFilters(this.activeFilters.slice());
        return this.callAPI(event, l);
        },
    inputChange(e){
        e.target.getInputElement().then(res => this.searchInput = res.value);
    },
    getRandomInt(max=6) {
        return Math.floor(Math.random() * Math.floor(max));
    },
    addFilter(i){
        if(!this.activeFilters.includes(i)){
            const filter = document.querySelector(`#filter_${i}`);
            filter.classList.add('active');
            this.activeFilters.push(i);
        }
    },
    removeFilter(i){
        if(this.activeFilters.includes(i)){
            const filter = document.querySelector(`#filter_${i}`);
            filter.classList.remove('active');
            this.activeFilters.splice(this.activeFilters.findIndex(filter => filter == i),1);
        }
    },
    btnSearch(event){
        Restore.methods.Search.shutTop();
        this.saveFilters = this.activeFilters.slice();
        Restore.data.Search.saveFilters = this.saveFilters;
        this.loadingData(this.search, event, 'Searching');
    },
    loadingData(callBack, event,  message='Loading Details'){
      return this.$ionic.loadingController
        .create({
          message
        })
        .then(l => {
          callBack(event, l);
          return l.present()
        })
    },
  },
  mounted(){
    const icons = ["rocket", "train", "jet", "car", "boat", "bicycle"];
    this.searchIcon = icons[this.getRandomInt()];
    if(Restore.data.Search.searchInput)
        this.searchInput = Restore.data.Search.searchInput;
    if(Restore.data.Search.activeFilters.length){
        Restore.data.Search.activeFilters.forEach(i => {
            setTimeout(() => this.addFilter(i), 100);
        })
    }
    if(Restore.data.Search.searchCache.length){
        this.searchResult = Restore.data.Search.searchCache;
        if(Restore.data.Search.top)
            this.fullFilled = true;
    }else{
        fetch(window.url + '/top/anime')
            .then(res => res.json())
            .then(res => {
                this.searchResult = res.top;
                Restore.methods.Search.setSearchCache(this.searchResult);
            })
            .then(() => this.fullFilled = true)
    }
    setTimeout(() => document.querySelector('#search-content')
            .scrollByPoint(0, Restore.data.Search.scrollPos, 0), 100)
  },
}
</script>