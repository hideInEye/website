<template>
  <div class="containers auto-width">
    <el-backtop target=".containers"></el-backtop>
    <ul class="menu" v-show="isMenu">
      <li>WorkSpace</li>
      <li>Life</li>
      <li>Q&A</li>
      <li>Other</li>
    </ul>
    <div class="slogn">
      <p>
        努力一直是平凡的人活着的勇气,如果你不努力,那你只是一具尸体. <br />
        Efforts have always been the courage of ordinary people to live. If you don't work hard, you are just a corpse.
      </p>
      <el-image class="slogn-logo" src="/image/teaching.png"></el-image>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRef, reactive, ref } from 'vue';

export default defineComponent({
  setup() {
    let isMenu = ref(false);

    onMounted(() => {

      window.addEventListener('scroll', () => {
        if (!isMenu.value) {
          isMenu.value = true;
        }

        if (window.scrollY === 0 && isMenu.value) {
          isMenu.value = false;
        }
      });

    })

    return {
      isMenu
    };
  },
});
</script>

<style scoped lang="less">
.containers {

  .menu {
    width: 100px;
    list-style: none;
    position: fixed;
    left: 10%;
    top: 100px;
    text-align: right;

    li {
      cursor: pointer;
      line-height: 30px;
      font-size: 18px;
      font-weight: 300;
      color: --el-color-dark-context;

      &:hover {
        color: #409eff;
      }
    }
  }

  .slogn {
    font-size: 14px;
    color: --el-color-dark-context;
    border-radius: 3px;
    line-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: linear-gradient(45deg, #0072F5 -20%, #FF4ECD 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    // box-shadow: -1px 2px 10px rgb(34, 178, 92);
    // background: linear-gradient(90deg,
    //     rgb(66, 111, 183),
    //     rgb(33, 141, 33),
    //     rgb(190, 168, 58));
    p:first-of-type {
      width: 500px;
    }

    &-logo {
      width: 400px;
    }
  }
}
</style>
