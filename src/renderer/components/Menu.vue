<template>
  <div class="menu">
    <div class="menu-group" v-for="(x, i) in menus" :key="i">
      <template v-if="x.subs && x.subs.length">
        <div class="menu-title">{{ x.title }}</div>
        <div class="p10">
          <div
            class="menu-item"
            v-for="(y, j) in x.subs"
            :key="j"
            :class="{ 'menu-active': activeKey === y.key }"
            @click="handleSelectMenu(y.key)"
          >
            {{ y.title }}
          </div>
        </div>
      </template>
      <div
        v-else
        class="menu-item"
        :class="{ 'menu-active': activeKey === x.key }"
        @click="handleSelectMenu(x.key)"
      >
        {{ x.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'c-menu',
  props: {
    menus: {
      type: Array,
      default: []
    },
    active: {
      type: Number | String
    }
  },
  data () {
    return {
      activeKey: this.active
    }
  },
  watch: {
    active: function (val) {
      this.activeKey = val
    }
  },
  methods: {
    handleSelectMenu (activeKey) {
      if (this.activeKey === activeKey) return

      this.activeKey = activeKey
      this.$emit('click', activeKey)
    }
  }
}
</script>

<style lang="less">
@import url('@/styles/index.less');
.menu {
  &-title {
    color: @heading-color;
  }

  &-item {
    padding: 5px 0;
    cursor: pointer;
    color: @text-color;
  }

  &-active {
    color: @primary-color;
  }
}
</style>
