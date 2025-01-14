<template>
  <div class="profile" style="background-color: #f5f5f5">
    <div class="card">
      <div class="title">My Profile</div>
      <div style="float: left; margin-top: 20px">
        <div class="avtor">
          <a-upload
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="apiUrl + 'upload'"
            :before-upload="beforeUpload"
            @change="handleChange"
            style="width: 188px; height: 188px"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="img" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">G</div>
            </div>
          </a-upload>
          <img class="add" src="../../assets/img/44.png" alt="" />
        </div>
        <div style="font-size: 32px; margin-top: 10px">Your Profile</div>
        <div
          style="
            word-wrap: break-word;
            width: 300px;
            height: auto;
            font-size: 26px;
            color: #979797;
            line-height: 36px;
          "
        >
          <!-- infornat on yo4 5harwill be used across this appto help tutars get to
          knawyou, leamn more -->
        </div>
      </div>
      <div
        style="
          width: 500px;
          margin: 0 auto;
          float: left;
          margin: 20px 0 0 200px;
        "
      >
        <a-row style="margin-top: 30px">
          <div>
            <img
              style="width: 50px; height: 50px; float: left; margin-right: 10px"
              src="../../assets/img/11.png"
              alt=""
            />
            <span style="font-size: 36px; color: #fff">Acaemic Goals</span>
          </div>
          <a-input
            v-model:value="goals"
            style="margin-top: 15px; width: 500px"
            size="large"
            type="text"
            @blur="updateUserType($event, 'goals')"
          ></a-input>
        </a-row>
        <a-row style="margin-top: 30px">
          <div>
            <img
              style="width: 50px; height: 50px; float: left; margin-right: 10px"
              src="../../assets/img/22.png"
              alt=""
            />
            <span style="font-size: 36px; color: #fff"
              >Areas of difficulty</span
            >
          </div>
          <a-input
            v-model:value="difficulty"
            style="margin-top: 15px; width: 500px"
            size="large"
            type="text"
            @blur="updateUserType($event, 'difficulty')"
          ></a-input>
        </a-row>
        <a-row style="margin-top: 30px">
          <div>
            <img
              style="width: 50px; height: 50px; float: left; margin-right: 10px"
              src="../../assets/img/33.png"
              alt=""
            />
            <span style="font-size: 36px; color: #fff">Languages I Speak</span>
          </div>
          <a-input
            v-model:value="languages"
            style="margin-top: 15px; width: 500px"
            size="large"
            type="text"
            @blur="updateUserType($event, 'languages')"
          ></a-input>
        </a-row>
        <a-row style="margin-top: 230px">
          <a-button
            @click="handleLoginOut"
            style="
              color: #fff;
              font-size: 20px;
              width: 200px;
              height: 50px;
              background: rgb(190, 200, 200);
              margin: 0 auto;
            "
            >Log Out</a-button
          >
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { useStore } from "vuex";
import { updateUser } from "@/api/user";
import { useRouter } from "vue-router";
export default {
  setup() {
    const message = inject("message");
    const store = useStore();
    const loading = ref(false);
    const imageUrl = ref("");
    const goals = ref("");
    const difficulty = ref("");
    const languages = ref("");
    const id = ref("");
    const router = useRouter();

    const cleanSys = () => {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("userInfo");
    };
    const handleLoginOut = () => {
      cleanSys();
      message.success("logout successfully");
      router.replace("/login");
    };

    const updateUserType = (e, type) => {
      // console.log(e.target.value, type);
      updateUser(id.value, {
        [type]: e.target.value,
      }).then((res) => {
        if (res.code === 200) {
          window.localStorage.setItem("userInfo", JSON.stringify(res.data));
          message.success("Operation successful");
          visible.value = false;
          store.dispatch("user/fetchUsers");
        }
      });
    };

    const apiUrl = import.meta.env.VITE_DEV_API_BASE_URL;

    onMounted(() => {
      // store.dispatch("user/fetchUsers");
      let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      imageUrl.value = userInfo.author ? apiUrl + userInfo.author : "";
      goals.value = userInfo.goals;
      difficulty.value = userInfo.difficulty;
      languages.value = userInfo.languages;
      id.value = userInfo._id;
      console.log("userInfo", userInfo);
    });

    // function getBase64(img, callback) {
    //   const reader = new FileReader();
    //   reader.addEventListener("load", () => callback(reader.result));
    //   reader.readAsDataURL(img);
    // }

    const handleChange = (info) => {
      if (info.file.status === "uploading") {
        loading.value = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        // getBase64(info.file.originFileObj, (base64Url) => {
        //   imageUrl.value = base64Url;
        //   loading.value = false;
        // });
        imageUrl.value = apiUrl + info.file.response.file.path;
        loading.value = false;
        updateUser(id.value, {
          author: info.file.response.file.path,
        }).then((res) => {
          if (res.code === 200) {
            window.localStorage.setItem("userInfo", JSON.stringify(res.data));
            message.success("Operation successful");
            visible.value = false;
            store.dispatch("user/fetchUsers");
          }
        });
      }
      if (info.file.status === "error") {
        loading.value = false;
        message.error("upload error");
      }
    };
    const beforeUpload = (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    };
    return {
      beforeUpload,
      handleChange,
      loading,
      imageUrl,
      apiUrl,
      goals,
      difficulty,
      languages,
      updateUserType,
      handleLoginOut,
    };
  },
};
</script>

<style lang="scss">
img[src=""] {
  background: red;
}
.profile {
  .card {
    width: 100%;
    height: auto;
    min-height: calc(100vh - 100px);
    border-radius: 30px;
    background: #b8c4d4;
    padding: 50px 50px 50px 150px;
  }
  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 36px;
    font-weight: bold;
    text-align: center;
  }
}

.avatar-uploader > .ant-upload {
  width: 188px;
  height: 188px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.avtor {
  position: relative;
  width: 188px;
  height: 188px;
  line-height: 188px;
  background: #000;
  border-radius: 50%;
  text-align: center;
  font-size: 56px;
  margin-top: 30px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  .ant-upload-select-picture-card {
    width: 188px !important;
    height: 188px !important;
    border: none !important;
    background-color: transparent !important;
  }
  .ant-upload-text {
    font-size: 40px;
    color: #fff;
  }
  .img {
    width: 188px;
    height: 188px;
    object-fit: cover;
    border-radius: 50%;
  }
  .add {
    position: absolute;
    width: 100px;
    bottom: -10px;
    left: 50%;
    margin-left: -50px;
    pointer-events: none;
  }
}
</style>
