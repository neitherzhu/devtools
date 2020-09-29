<template>
  <div class="project-item" @click="handleClick">
    <div class="flex mb15">
      <img class="project-item-icon mr5" :src="project.iconSrc" />
      <div class="project-name ellipsis" :title="project.name">
        {{ project.name }}
      </div>
    </div>
    <div class="project-local-path ellipsis2 mb5" :title="project.locate">
      项目目录: {{ project.locate }}
    </div>
    <div
      class="project-local-path ellipsis"
      :title="project.desc"
      v-if="project.desc"
    >
      项目描述: {{ project.desc }}
    </div>
    <div class="project-actions">
      <a-tooltip placement="top" title="删除项目记录">
        <a-icon
          type="delete"
          class="project-actions-btn mr5"
          @click.stop="handleDelete()"
        />
      </a-tooltip>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'project-item',
  props: {
    project: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    ...mapActions('projects', ['remove']),
    handleDelete () {
      this.$confirm({
        title: '确定要移除' + this.project.name + '吗？',
        content: '删除项目只会删除记录，不会删除硬盘上的项目文件',
        onOk: () => {
          this.remove(this.project)
        }
      })
    },
    handleClick () {
      this.$emit('click', this.project)
    }
  }
}
</script>

<style lang="less">
@import url('@/styles/index.less');

.project {
  &-item {
    position: relative;
    width: 258px;
    height: 160px;
    background: #fff;
    box-shadow: @box-shadow-base;
    margin: 0 20px 20px 0;
    padding: 20px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      box-shadow: @box-shadow-hover;
    }

    &-icon {
      width: 45px;
      height: 45px;
      background: #fff;
      padding: 2px;
      border-radius: 100%;
      border: 1px solid @border-color-base;
    }
  }

  &-actions {
    position: absolute;
    bottom: 5px;
    right: 0;

    &-btn {
      color: @disabled-color!important;
      &:hover {
        color: @link-color!important;
      }
    }
  }

  &-create {
    border: 1px dashed transparent;
    color: @text-color-secondary;

    &:hover {
      border-color: @primary-color;
      color: @primary-color;
    }
  }

  &-name {
    line-height: 45px;
    color: @heading-color;
    font-size: 18px;
  }

  &-local-path {
    color: @text-color-secondary;
  }
}
</style>
