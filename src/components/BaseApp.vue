<template>
  <ion-app v-if="render">
      <slot />
  </ion-app>
</template>

<script>
export default {
  name: 'baseApp',
  props: {
    
  },
  data(){
    return{
      render : true,
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
