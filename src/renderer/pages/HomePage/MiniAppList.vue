<template>
  <div class="flex flex-wrap p20">
    <div
      class="project-item project-create flex flex-center f16"
      @click="handleCreateProject"
    >
      <a-icon type="plus" class="f20 mr5" />创建
    </div>
    <project-item
      v-for="x in projects"
      :key="x.id"
      :project="x"
      @click="handlePorjectClick"
    />
  </div>
</template>

<script>
import ProjectItem from '@/components/ProjectItem.vue'
import { CARD_MINI_APP_TYPE } from '@/constants'

export default {
  name: 'mini-app-list',
  components: {
    ProjectItem
  },
  computed: {
    projects () {
      return this.$store.state.projects.filter(
        x => x.type === Number(this.$route.params.type)
      )
    }
  },
  methods: {
    handleCreateProject () {
      this.$router.push({
        name: 'create-mp',
        params: {
          type: this.$route.params.type
        }
      })
    },
    handlePorjectClick ({ type, id }) {
      if (type === CARD_MINI_APP_TYPE) {
        this.$router.push({ name: 'card-list', params: { id } })
      } else {
        // todo 打开项目
      }
    }
  }
}
</script>
