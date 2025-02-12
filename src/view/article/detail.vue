<template>
  <div @click="changeArticle">编辑文章</div>
  <div @click="deleteArticle">删除文章</div>
  <div>
    {{ form.title || '暂无标题' }}
  </div>
  <div
    style="width: auto"
    v-html="form.content || '暂无内容'"
    class="content"
  ></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { deletePosts, getDetail } from '@/axios/request';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();

    const query = route.query;
    const id = query.id as string;

    let form = reactive({
      title: '',
      content: '',
    });

    onMounted(() => {
      if (!id) return;

      getDetail(id).then((res: any) => {
        if (res.code > 300) {
        } else {
          const { item } = res;
          form.title = item.title;
          form.content = item.content;
        }
      });
    });
    const changeArticle = () => {
      router.push({
        path: '/admin',
        query: {
          id: id,
        },
      });
    };
    const deleteArticle = () => {
      console.log('删除文章');
      if (!id) return;
      deletePosts(id).then((res: any) => {
        if (res.code > 300) {
          ElMessage.error({
            message: res.message,
            type: 'error',
          });
        } else {
          ElMessage.success({
            message: '删除成功',
            type: 'success',
          });
          router.push('/home');
        }
      });
    };
    return {
      form,
      changeArticle,
      deleteArticle,
    };
  },
});
</script>

<style scoped lang="less">
.content {
  img {
    width: 100%;
  }
}
</style>