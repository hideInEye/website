<template>
  <div class="auto-width">
    <el-form :model="form">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <div style="border: 1px solid #ccc">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 500px; overflow-y: hidden"
          v-model="form.content"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </div>
      <div class="save">
        <el-button type="default">取消</el-button>
        <el-button @click="Submit" type="primary">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  shallowRef,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IDomEditor, IEditorConfig } from '@wangeditor/core';
import { ElMessage } from 'element-plus';
import { createPosts, getDetail, updatePost } from '@/axios/request';
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();
    const router = useRoute();
    const route = useRouter();

    const query = router.query;
    const id = query.id as string;

    onMounted(() => {
      if(!id)return
      getDetail(id).then((res: any) => {
        if (res.code > 300) {
        } else {
          const { item } = res;
          form.title = item.title;
          form.content = item.content;
        }
      });
    });

    const toolbarConfig = {};
    const editorConfig: Partial<IEditorConfig> = { MENU_CONF: {} };

    editorConfig.MENU_CONF = {
      uploadVideo: {
        server: '/api/upload-video',
      },
      // 上传图片的配置
      uploadImage: {
        server: 'api/upload-img',
        maxFileSize: 1 * 1024 * 1024, // 1M
        // 最多可上传几个文件，默认为 100
        maxNumberOfFiles: 10,
        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['image/*'],
        // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
        // meta: {
        //   token: 'xxx',
        //   otherKey: 'yyy'
        // },

        // 将 meta 拼接到 url 参数中，默认 false
        metaWithUrl: false,

        // 自定义增加 http  header
        // headers: {
        //   Accept: 'text/x-json',
        //   otherKey: 'xxx'
        // },

        // 跨域是否传递 cookie ，默认为 false
        withCredentials: false,

        // 超时时间，默认为 10 秒
        timeout: 5 * 1000, // 5 秒
        // 上传之前触发
        onBeforeUpload(file: File) {
          // TS 语法
          // onBeforeUpload(file) {    // JS 语法
          // file 选中的文件，格式如 { key: file }
          return file;

          // 可以 return
          // 1. return file 或者 new 一个 file ，接下来将上传
          // 2. return false ，不上传这个 file
        },

        // 上传进度的回调函数
        onProgress(progress: number) {
          // TS 语法
          // onProgress(progress) {       // JS 语法
          // progress 是 0-100 的数字
          console.log('progress', progress);
        },

        // 单个文件上传成功之后
        onSuccess(file: File, res: any) {
          // TS 语法
          // onSuccess(file, res) {          // JS 语法
          console.log(`${file.name} 上传成功`, res);
        },

        // 单个文件上传失败
        onFailed(file: File, res: any) {
          // TS 语法
          // onFailed(file, res) {           // JS 语法
          console.log(`${file.name} 上传失败`, res);
        },

        // 上传错误，或者触发 timeout 超时
        onError(file: File, err: any, res: any) {
          // TS 语法
          // onError(file, err, res) {               // JS 语法
          console.log(`${file.name} 上传出错`, err, res);
        },
      },
    };
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    const handleCreated = (editor: IDomEditor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };

    const form = reactive({
      title: '',
      content: '',
    });

    const Submit = async () => {
      if (id) {
        updatePost(id, {...form}).then((res: any) => {
          if (res && res.code < 300) {
            ElMessage.success({
              message: '更新成功',
              type: 'success',
            });
            return;
          }
          ElMessage.success({
            message: res.message,
            type: 'error',
          });
        });
      } else {
        createPosts({...form}).then((res: any) => {
          if (res && res.code < 300) {
            ElMessage.success({
              message: '保存成功',
              type: 'success',
            });
            route.push('/home');
            return;
          }
          ElMessage.success({
            message: res.message,
            type: 'error',
          });
        });
      }
    };

    return {
      form,
      editorRef,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      Submit,
    };
  },
});
</script>

<style lang="less" scoped>
.save {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 90px;
}
</style>
