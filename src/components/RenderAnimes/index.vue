<template>
  <grid style="margin-top: 20px"
      :center="true"
      :draggable="false"
      :sortable="false"
      :items="animes"
      :cellHeight="150" 
      :cellWidth="120">
      <template slot="cell" slot-scope="props">
        <animeCard
          :key="props.item.mal_id"
          :id="props.item.mal_id"
          :title="props.item.title"
          :img="props.item.image_url"
        />
      </template>
  </grid>
</template>

<script>
import animeCard from './animeCard'


/* H 150 135  // 130 115
   W 120 100  // 100 80
  :cellHeight="sugest ? 125 : 150" 
  :cellWidth="sugest ? 95 : 120">
*/

export default{
  name: 'renderAnimes',
  components:{
    animeCard,
  },
  props: {
    animes : {type: Array,  default(){return[]}},
  },
}
</script>
