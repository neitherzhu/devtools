<template>
  <div class="flex flex-wrap p20">
    <div
      class="card-item card-create flex flex-center f14"
      @click="handleCreateCard"
    >
      <a-icon type="plus" class="f16 mr5" />创建卡片
    </div>
    <card-item
      v-for="x in cards"
      :key="x.id"
      :card="x"
      @click="handleCardClick"
      @copy="handleCopyClick"
    ></card-item>
  </div>
</template>

<script>
import CardItem from '@/components/CardItem'

export default {
  name: 'card-list',
  components: {
    CardItem
  },
  computed: {
    cards () {
      return this.$store.state.cards.filter(
        x => x.mpId === Number(this.$route.params.id)
      )
    }
  },
  methods: {
    handleCreateCard () {
      this.$router.push({
        name: 'create-card',
        params: { id: this.$route.params.id }
      })
    },
    handleCopyClick (card) {
      this.$router.push({
        name: 'create-card',
        params: {
          id: this.$route.params.id,
          copyFrom: card.id
        }
      })
    },
    handleCardClick (x) {
      // todo 打开项目
      console.log(x)
      // this.$router.push({ name: 'editor-page' })
    }
  }
}
</script>
