<template>
  <ion-app v-if="render">
    <slot />
  </ion-app>
</template>

<script>
import Options from '@/store/Options';

export default {
  name: 'baseApp',
  data(){
    return{
      render : true,
      options : Options.data
    }
  },
  computed:{
    darkModeListener(){
      if(this.options.darkMode)
        document.body.classList.add('dark-mode');
      else document.body.classList.remove('dark-mode'); 
      return '';
    }
  },
  methods:{
    forceRerender() {
      this.render = false;
      
      this.$nextTick(() => {
        this.render = true;
      })
    },
  },
  created(){
    this.forceRerender();
  }
}
</script>
