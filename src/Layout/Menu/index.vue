<template>
  <el-menu :default-active="activeIndex" class="" mode="horizontal" :ellipsis="false">
    <router-link to="/home">
      <el-menu-item index="1">
        Home
      </el-menu-item>
    </router-link>
    <router-link to="/admin">
      <el-menu-item index="2">
        Administration
      </el-menu-item>
    </router-link>
    <router-link to="/about">
      <el-menu-item index="3">
        About
      </el-menu-item>
    </router-link>
  </el-menu>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Menu',
  setup() {
    const store = useStore();
    const titleShow = computed(() => store.state.Layout.titleShow);
    const activeIndex = ref('1');
    return {
      titleShow,
      activeIndex,
    };
  },
});
</script>
<style lang="less" scoped>
.el-menu {
  border: none;

  .el-menu-item {
    border: none;
  }
}
</style>
>
