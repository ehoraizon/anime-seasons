<template>
  <div id="popover">
    <ion-header>
      <ion-toolbar>
        <ion-title class="popover-title" slot="start">{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <ion-radio-group id="one" :value="radio.order.prop" class="ion-padding-start ion-padding-end" @click="changeOrder()">
            <div class="label-name label-name-weight ion-padding-start ion-padding-bottom"> Información </div>
            <ion-row>
                <ion-col size="6">
                  <div class="label-name ion-padding-start"> ID </div>
                </ion-col>
                <ion-col size="6">
                  <ion-radio value="id" class="margin-end"></ion-radio>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="6">
                  <div class="label-name ion-padding-start"> Alias </div>
                </ion-col>
                <ion-col size="6">
                  <ion-radio value="alias" class="margin-end"></ion-radio>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="6">
                  <div class="label-name ion-padding-start"> Nivel </div>
                </ion-col>
                <ion-col size="6">
                  <ion-radio value="lvl" class="margin-end"></ion-radio>
                </ion-col>
            </ion-row>
        </ion-radio-group>
        <ion-radio-group id="two" :value="radio.order.direct" class="ion-padding-end" @click="changeOrder()">
            <div class="label-name label-name-weight ion-padding-start ion-padding-bottom"> Dirección </div>
            <ion-row>
                <ion-col size="6">
                  <div class="label-name ion-padding-start"> Normal </div>
                </ion-col>
                <ion-col size="6">
                  <ion-radio value="1" class="margin-end"></ion-radio>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col size="6">
                  <div class="label-name ion-padding-start"> Inverso </div>
                </ion-col>
                <ion-col size="6">
                  <ion-radio value="-1" class="margin-end"></ion-radio>
                </ion-col>
            </ion-row>
        </ion-radio-group>
    </ion-content>
  </div>
</template>

<script>
import Options from '../../store/Options';

export default {
  name: 'Popover',
  props: {
    title: { type: String, default: 'Elije el order' },
  },
  data() {
    return {
      content: 'Content',
      radio: Options.data
    }
  },
  methods: {
    close() {
      this.$parent.$emit('close', { foo: 'bar' })
    },
    changeOrder(){
        const prop = document.getElementById("one").value;
        const direct = Number.parseInt(document.getElementById("two").value);
        console.log(prop + ' ' + direct)
        Options.methods.changeOrder(prop, direct);
    }
  },
}
</script>

<style scoped>
    .label-name{
        margin: 0!important;
        font-size: 1rem!important;
    }
    .label-name-weight{
        font-weight: 600;
    }
    .popover-title{
        font-size: 1.1rem!important;
    }
    .margin-end{
        margin-left: 45px!important; 
    }
    ion-toolbar{
        --min-height: 40px;
    }
</style>
