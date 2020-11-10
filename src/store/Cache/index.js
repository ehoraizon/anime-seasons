import Restore from '@/store/Restore';

const seasons = [];
const yearsMax = 5;
for(let i = 0; i < yearsMax; i++){
    seasons.push([null,null,null,null])
}

const Cache = {
    data: {
        currentSeason : null,
        yearsMax,
        seasons,
        cached : [],
        favorites : [], //[anime_id],
        mySavedFavorites: [],
        videos : [],
        sheduler: [],
        videosAdpassed: [], //id
        savedReview: [], //[{id : mal_id, {}}]
        savedSugest: [], //[{id : mal_id, {}}]
    },
    methods: {
        saveSugest(id, sugest){
            Cache.data.savedSugest.push({id, sugest})
        },
        getSugest(id){
            return Cache.data.savedSugest.find(item => item.id == id);
        },
        saveVideoAd(id){
            Cache.data.videosAdpassed.push(id);
        },
        passed(id){
            return !!Cache.data.videosAdpassed.find(item => item == id);
        },
        saveSheduler(day){
            Cache.data.sheduler = day;
        },
        saveSeason(season, indexes){
            Cache.data.seasons[indexes[0]][indexes[1]] = season;
        },
        addFavorite(id){
            Cache.data.favorites.push(id);
            window.setItem(Cache.data.favorites, window.key);
            if(!Cache.data.mySavedFavorites.find(item => item.mal_id == id)){
                const pushRes = item => {
                    Cache.data.mySavedFavorites.push(item)
                }
                let get = undefined
                if(Cache.data.season){
                    get = Cache.data.season.anime.slice().find(item => item.mal_id == id);
                    if(get){
                        pushRes(get);
                        return;
                    }
                }
                get = Cache.methods.getAnime(id);
                if(get){
                    pushRes(get);
                    return;
                }
                get = Restore.data.Search.searchCache.slice().find(item => item.mal_id == id);
                if(get){
                    pushRes(get);
                    return;
                }
                fetch(window.url+`/anime/${id}`).then(res => res.json())
                                                .then(res => pushRes(res));
            }
        },
        removeFavorite(id){
            Cache.data.favorites = Cache.data.favorites.filter(item => item != id);
            window.setItem(Cache.data.favorites, window.key);
        },
        getAnime(id){
            return Cache.data.cached.find(anime => anime.mal_id == id);
        },
        saveAnime(anime){
            Cache.data.cached.push(anime);
        },
        getVideo(id){
            return Cache.data.videos.find(video => video.id == id);
        },
        saveVideo(video){
            Cache.data.videos.push(video);
        }
    },
}

export default Cache;