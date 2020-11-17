import Restore from '@/store/Restore';
import Options from '../Options';

const seasons = [];
const yearsMax = 5;
for(let i = 0; i < yearsMax; i++){
    seasons.push([null,null,null,null])
}

/*

    animeEpisodes : {
        watched : [{
            id : anime_id,
            n : [episode_number],
        }]
        es : [
            {
                id : anime_id,
                urlThumbsInd : [[]],
                episodes : [{
                    n : episode_number,
                    sources : [{}],
                }]
            }
        ],
        en : ...
    }

*/

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
        savedReview: [], //[{id : mal_id, {}}]
        savedSugest: [], //[{id : mal_id, {}}]
        animeEpisodes : {
            watched : [],
            es : [],
            en : []
        }
    },
    methods: {
        saveSugest(id, sugest){
            Cache.data.savedSugest.push({id, sugest})
        },
        getSugest(id){
            return Cache.data.savedSugest.find(item => item.id == id);
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
            new Promise(() => Cache.methods.fetchSavedFavorites(id));
        },
        removeFavorite(id){
            Cache.data.favorites = Cache.data.favorites.filter(item => item != id);
            window.setItem(Cache.data.favorites, window.key);
        },
        fetchSavedFavorites(id){
            const pushRes = item => {
                Cache.data.mySavedFavorites.push(item)
            } 
            const check = id => {
                if(!Cache.data.mySavedFavorites.find(item => item.mal_id == id)){
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
            }

            check(id);
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
        },
        getEpisodes(id){
            const lang = Options.data.lang;
            for(let anime of Cache.data.animeEpisodes[lang]){
                if(anime.id == id)
                    return anime.urlThumbsInd;
            }
            return null;
        },
        getSources(id, n){
            const lang = Options.data.lang;
            for(let anime of Cache.data.animeEpisodes[lang]){
                if(anime.id == id){
                    for(let episode of anime.episodes){
                        if(episode.n == n)
                            return episode.sources;
                    }
                    return null;
                }
            }
            return null;
        },
        saveEpisodes(id, urlThumbsInd){
            const lang = Options.data.lang;
            for(let anime of Cache.data.animeEpisodes[lang]){
                if(anime.id == id){
                    anime.urlThumbsInd = urlThumbsInd;
                    return;
                }
            }

            Cache.data.animeEpisodes[lang].push({
                id,
                urlThumbsInd,
                episodes : []
            })
        },
        saveSources(id, n, sources){
            const lang = Options.data.lang;
            for(let anime of Cache.data.animeEpisodes[lang]){
                if(anime.id == id){
                    for(let episode of anime.episodes){
                        if(episode.n == n){
                            episode.sources = sources;
                            return null;
                        }
                    }
                    anime.episodes.push({
                        n,
                        sources,
                    })
                }
            }
            
            Cache.data.animeEpisodes[lang].push({
                id,
                urlThumbsInd : [],
                episodes : [{
                    n,
                    sources,
                }]
            })
        },
        getWatched(id){
            for(let anime of Cache.data.animeEpisodes.watched){
                if(anime.id == id)
                    return anime.n;
            }
            return [];
        },
        saveWatched(id, n){
            for(let anime of Cache.data.animeEpisodes.watched){
                if(anime.id == id)
                    anime.n.push(n);
            }
            Cache.data.animeEpisodes.watched.push({
                id,
                n : [n]
            })
            window.setItem(Cache.data.animeEpisodes.watched, window.watched);
        }
    },
}

export default Cache;