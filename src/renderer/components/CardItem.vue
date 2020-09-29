<template>
  <div class="card-item" @click="handleClick">
    <div class="card-name ellipsis mb10" :title="card.name">
      {{ card.name }}
    </div>
    <div
      class="card-desc mb5 ellipsis"
      :title="card.enName + '-' + card.cardId"
    >
      {{ card.enName + '-' + card.cardId }}
    </div>
    <div class="card-desc ellipsis" :title="card.desc" v-if="card.desc">
      卡片描述: {{ card.desc }}
    </div>
    <div class="card-actions">
      <a-tooltip placement="top" title="预览卡片">
        <a-icon
          type="qrcode"
          class="card-actions-btn mr5"
          @click.stop="handleUpload()"
        />
      </a-tooltip>
      <a-tooltip placement="top" title="发布卡片">
        <a-icon
          type="cloud-upload"
          class="card-actions-btn mr5"
          @click.stop="handleUpload()"
        />
      </a-tooltip>
      <a-tooltip placement="top" title="复制卡片">
        <a-icon
          type="copy"
          class="card-actions-btn mr5"
          @click.stop="handleCopy()"
        />
      </a-tooltip>
      <a-tooltip placement="top" title="删除卡片记录">
        <a-icon
          type="delete"
          class="card-actions-btn mr5"
          @click.stop="handleDelete()"
        />
      </a-tooltip>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'card-item',
  props: {
    card: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    ...mapActions('cards', ['remove']),
    handleDelete () {
      this.$confirm({
        title: '确定要移除' + this.card.name + '吗？',
        content: '删除卡片只会删除记录，不会删除硬盘上的卡片文件',
        onOk: () => {
          this.remove(this.card)
        }
      })
    },
    handleClick () {
      this.$emit('click', this.card)
    },
    handleCopy () {
      this.$emit('copy', this.card)
    },
    handleUpload () {
      // 1.判断是否存在dist
      // 2.压缩dist文件目录
      // 3.上传
    }
  }
}
</script>

<style lang="less">
@import url('@/styles/index.less');

.card {
  &-item {
    position: relative;
    width: 200px;
    height: 124px;
    background: #fff;
    box-shadow: @box-shadow-base;
    margin: 0 20px 20px 0;
    padding: 20px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      box-shadow: @box-shadow-hover;
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
    line-height: 30px;
    color: @heading-color;
    font-size: 18px;
  }

  &-desc {
    color: @text-color-secondary;
  }
}
</style>
