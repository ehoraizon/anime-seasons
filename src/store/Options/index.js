const Options = {
    data : {
        order: {
            prop : 'id',
            direct : 1
        },
        darkMode : false,
        lang: 'en'
    },
    methods: {
        changeOrder: function(prop, direct){
            Options.data.order.prop = prop;
            Options.data.order.direct = direct;
            this.saveData();
        },
        //webpack error from eval "this is not a function"
        toogleDarkMode: function(){
            Options.data.darkMode = !Options.data.darkMode;
            this.saveData();
        },
        saveData: function(){
            window.setItem(Options.data, window.options);
        },
        darkMode : function(){
            Options.data.darkMode = !Options.data.darkMode;
            this.saveData();
        },
        changeLanguage : function(lang){
            Options.data.lang = lang;
            this.saveData();
        }
    },
};

export default Options;