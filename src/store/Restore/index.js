const Restore = {
    data : {
        Home: {
            scrollPos: 0,
            currentIndex: 0,
            currentYear: new Date().getFullYear(),
        },
        Search:{
            scrollPos: 0,
            searchInput: null,
            searchCache: [],
            activeFilters: [],
            saveFilters: [],
            fullFilled: false,
            page: 0,
            cacheUrl: '',
            top: true,
        },
        Follow:{
            scrollPos: 0,
        },
        Sheduler:{
            scrollPos: 0,
        }
    },
    methods: {
        Home:{
            setScrollPos(y){
                Restore.data.Home.scrollPos = y;
            },
            setCurrentIndex(i){
                Restore.data.Home.currentIndex = i;
            },
            setCurrentYear(year){
                Restore.data.Home.currentYear = year;
            }
        },
        Search:{
            shutTop(){
                Restore.data.Search.top = false;
            },
            setScrollPos(y){
                Restore.data.Search.scrollPos = y;
            },
            setSearchInput(input){
                Restore.data.Search.searchInput = input;
            },
            setSearchCache(cache){
                Restore.data.Search.searchCache = cache;
            },
            setActiveFilters(filters){
                Restore.data.Search.activeFilters = filters;
            },
            setFullFilled(bool){
                Restore.data.Search.fullFilled = bool;
            },
            setPage(n){
                Restore.data.Search.page = n;
            },
            setCacheUrl(url){
                Restore.data.Search.cacheUrl = url;
            },
        },
        Follow:{
            setScrollPos(y){
                Restore.data.Follow.scrollPos = y;
            }
        },
        Sheduler:{
            setScrollPos(y){
                Restore.data.Sheduler.scrollPos = y;
            }
        },
    },
}

export default Restore;