<template>
  <div class="query" style="background-color: #f5f5f5">
    <div class="card">
      <a-modal
        v-model:visible="visible"
        :title="modalTitle"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-form
          :model="queryForm"
          name="basic"
          ref="courseFormRef"
          :rules="rules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
          autocomplete="off"
        >
          <a-form-item label="title" name="title">
            <a-input v-model:value="queryForm.title" />
          </a-form-item>
          <a-form-item label="content" name="content">
            <a-textarea v-model:value="queryForm.content" :rows="5" />
          </a-form-item>
        </a-form>
      </a-modal>
      <div
        style="
          width: 100%;
          height: 80px;
          line-height: 80px;
          text-align: center;
          font-size: 40px;
          color: #ccc;
        "
      >
        Conversation
      </div>
      <a-row :gutter="[0, 0]" style="margin: 0 0 20px 10px">
        <a-col :span="8" style="height: calc(100vh - 200px)">
          <div
            style="
              color: #777;
              text-align: center;
              font-size: 30px;
              margin-top: -55px;
              margin-bottom: 20px;
            "
          >
            QUERY
          </div>
          <div
            style="width: 100%; height: calc(100% - 50px); overflow-y: scroll"
          >
            <a-list
              style="background: #fef7fe"
              item-layout="horizontal"
              :data-source="data"
            >
              <template #renderItem="{ item, index }">
                <a-list-item
                  :style="
                    activeIndex == index
                      ? 'background: #E7DEFB'
                      : 'cursor: pointer'
                  "
                  @click="chooseMsg(item, index)"
                >
                  <template #extra>
                    {{ formattedDate(item.createdAt) }}
                  </template>
                  <a-list-item-meta :description="item.title">
                    <template #title>
                      <div style="margin-top: -20px">
                        {{ item.username }}
                      </div>
                    </template>
                    <template #avatar>
                      <a-avatar :src="apiUrl + item.author" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
          <div
            v-if="role === 0"
            style="
              width: 100%;
              text-align: center;
              height: 50px;
              background: #fef7fe;
            "
          >
            <a-button
              style="width: 150px; margin: 0 auto; margin-top: 3px"
              @click="visible = true"
              >Add New Query</a-button
            >
          </div>
        </a-col>
        <a-col style="background: #fff; height: calc(100vh - 200px)" :span="16">
          <a-list item-layout="horizontal" :data-source="[infoData]">
            <template #renderItem="{ item }">
              <a-list-item
                style="
                  height: 72px;
                  background: #fff;
                  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
                "
              >
                <a-list-item-meta>
                  <template #avatar>
                    <a-avatar
                      style="float: left"
                      size="large"
                      :src="apiUrl + item.author"
                    />
                    <div
                      style="float: left; font-size: 26px; margin-left: 20px"
                    >
                      {{ item.name }}
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <div
            style="width: 100%; height: calc(100% - 72px); background: #fff"
            v-if="infoData.name"
          >
            <div
              style="
                padding: 30px;
                width: 100%;
                height: calc(100% - 240px);
                background: #fff;
                overflow-y: scroll;
              "
            >
              <div
                class="left-msg"
                :class="item.type === 'message' ? 'left-msg' : 'right-msg'"
                :key="item.id"
                v-for="item in infoData.list"
              >
                <img :src="apiUrl + item.author" alt="" />
                <div class="msg">
                  <!-- 啊大撒上打算的撒打算的大撒大撒上的撒大打算的啊是的啊是的 -->
                  {{ item.content }}
                </div>
              </div>
              <!-- <div class="right-msg">
                <img src="" alt="" />
                <div class="msg">
                  啊大撒上打算的撒打算的大撒大撒上的撒大打算的啊是的啊是的
                </div>
              </div> -->
            </div>
            <div style="padding: 30px" v-if="role === 1 || role === 2">
              <div style="width: 100%; margin: 15px 0 15px 0">
                <a-button
                  @click="send('Let`s do it')"
                  style="background: #eadef6; margin-right: 15px"
                  >Let`s do it</a-button
                >
                <a-button
                  @click="send('Great!')"
                  style="background: #eadef6; margin-right: 15px"
                  >Great!</a-button
                >
                <a-button
                  @click="send('Great!')"
                  style="background: #eadef6; margin-right: 15px"
                  >Great!</a-button
                >
              </div>
              <a-textarea
                @pressEnter="send(content)"
                v-model:value="content"
                placeholder="请输入"
                :rows="5"
              />
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject, watch } from "vue";
import { useStore } from "vuex";
import { messagesSend, messagesReply } from "@/api/message";
import moment from "moment";

const message = inject("message");
const store = useStore();
const content = ref("");
const role = JSON.parse(window.localStorage.getItem("userInfo"))?.role;
const apiUrl = import.meta.env.VITE_DEV_API_BASE_URL;
const send = (msg) => {
  if (msg || content.value) {
    let obj = {
      conversationId: chatInfo.value[0].conversationId,
      content: msg || content.value,
      replyTo: chatInfo.value[0].id,
    };
    messagesReply(obj).then((res) => {
      console.log(res);
      if (res.code === 200) {
        content.value = "";
        store.dispatch("message/fetchMessages");
        store.dispatch("message/fetchUserMessagesInfo", {
          id: chatInfo.value[0].conversationId,
        });
        infoData.value.list = chatInfo;
      }
    });
  }
};
const queryForm = ref({
  title: "",
  content: "",
});
const visible = ref(false);
const modalTitle = ref("Add New Query");
const courseFormRef = ref(null);
const activeIndex = ref(0);
const data = computed(() => store.state.message.messages);
const chatInfo = computed(() => store.state.message.userMessagesInfo);
const infoData = ref({
  name: "",
  author: "",
  list: [],
});

const formattedDate = (datetime) => {
  return moment(datetime).format("YYYY-MM-DD HH:mm:ss");
};
const rules = {
  title: [
    { required: true, message: "Please enter the title!", trigger: "blur" },
  ],
  content: [
    {
      required: true,
      message: "Please enter the content!",
      trigger: "blur",
    },
  ],
};
const handleOk = () => {
  courseFormRef.value
    .validate()
    .then(() => {
      messagesSend(queryForm.value).then((res) => {
        if (res.code === 200) {
          store.dispatch("message/fetchMessages");
          message.success("Operation successful");
          visible.value = false;
          activeIndex.value = 0;
          setTimeout(() => {
            store.dispatch("message/fetchUserMessagesInfo", {
              id: data.value?.[0]?.conversationId,
            });
            infoData.value.list = chatInfo;
            infoData.value.name = data[0].username;
          }, 100);
          // store.dispatch("course/fetchCourse");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleCancel = () => {
  visible.value = false;
  // 清除校验状态
  if (courseFormRef.value) {
    courseFormRef.value.resetFields();
  }
};

const chooseMsg = (item, index) => {
  activeIndex.value = index;
  store.dispatch("message/fetchUserMessagesInfo", {
    id: data.value?.[index]?.conversationId,
  });
  infoData.value.list = chatInfo;
  infoData.value.name = item.username;
};
onMounted(() => {
  store.dispatch("message/fetchMessages");

  setTimeout(() => {
    infoData.value.name = data.value?.[0]?.username;
    infoData.value.author = data.value?.[0]?.author;
    console.log("data.value?.[0]?.userId", data.value?.[0]?.userId);
    store.dispatch("message/fetchUserMessagesInfo", {
      id: data.value?.[0]?.conversationId,
    });
    infoData.value.list = chatInfo;
  }, 100);
});
</script>

<style lang="scss">
img[src=""] {
  background: red;
}
.query {
  .card {
    width: 100%;
    height: auto;
    min-height: calc(100vh - 100px);
    border-radius: 30px;
    background: #ffffff;
    // padding: 50px 50px 50px 150px;
  }
}
.left-msg {
  width: 100%;
  height: 60px;
  line-height: 60px;
  margin-bottom: 30px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    float: left;
    margin: 15px 15px 0 0;
  }
  .msg {
    float: left;
    min-width: 50px;
    max-width: calc(100% - 100px);
    line-height: 40px;
    min-height: 60px;
    font-size: 20px;
    color: #000;
    background: #eae0eb;
    padding: 15px;
    border-radius: 26px 26px 18px 8px;
  }
}
.right-msg {
  width: 100%;
  height: 60px;
  line-height: 60px;
  margin-bottom: 30px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    float: right;
    margin: 15px 0 0 15px;
  }
  .msg {
    float: right;
    min-width: 50px;
    max-width: calc(100% - 100px);
    line-height: 40px;
    min-height: 60px;
    font-size: 20px;
    color: #000;
    background: #eae0eb;
    padding: 15px;
    border-radius: 26px 18px 8px 26px;
  }
}
</style>
