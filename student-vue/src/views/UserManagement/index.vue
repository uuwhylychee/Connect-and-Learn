<template>
  <div style="background-color: #f5f5f5">
    <div class="views-chart">
      <a-layout class="user-list-layout">
        <a-row align="middle" justify="space-between" gutter="{16}">
          <a-col>
            <h1>User Management</h1>
          </a-col>
          <a-col>
            <a-input-search
              placeholder="search user"
              v-model:value="searchText"
              @search="handleSearch"
              style="width: 200px; margin-right: 20px"
            />
            <a-button type="primary" @click="showModal">add user</a-button>
          </a-col>
        </a-row>
        <a-layout-content class="user-list-content">
          <a-table
            :columns="columns"
            :dataSource="filteredUsers"
            rowKey="id"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'role'">
                <div>
                  <a-tag v-if="record.role === 0" color="#87d068">Student</a-tag>
                  <a-tag v-if="record.role === 1" color="#108ee9">Admin</a-tag>
                  <a-tag v-if="record.role === 2" color="#108ee9">tutor</a-tag>
                  
                </div>
              </template>
              <template v-if="column.dataIndex === 'author'">
                <div>
                  <a-image
                    style="border-radius: 50%;"
                    v-if="record.author"
                    :width="40"
                    :height="40"
                    :src="apiUrl+record.author"
                  />
                </div>
              </template>
              <template v-if="column.dataIndex === 'disabled'">
                <div>{{ record.disabled ? 'Yes' : 'No' }}</div>
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-button type="primary" @click="editUser(record)"
                  >edit</a-button
                >
                <a-popconfirm
                  v-if="filteredUsers.length"
                  title="Sure to delete?"
                  @confirm="deleteItem(record._id)"
                >
                  <a-button type="delete">delete</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </a-layout-content>
        <!-- 用户表单模态框 -->
        <a-modal
          v-model:visible="visible"
          :title="modalTitle"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <a-form
            :model="userForm"
            name="basic"
            ref="userFormRef"
            :rules="rules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
          >
            <a-form-item label="Username" name="username">
              <a-input v-model:value="userForm.username" />
            </a-form-item>
            <a-form-item label="Password" name="password">
              <a-input-password
                type="password"
                v-model:value="userForm.password"
              />
            </a-form-item>
            <a-form-item label="Email" name="email">
              <a-input v-model:value="userForm.email" />
            </a-form-item>
            <a-form-item label="StudentID" name="studentID">
              <a-input v-model:value="userForm.studentID" />
            </a-form-item>
            <a-form-item label="Profile Image" name="author">
              <a-upload
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="apiUrl + 'upload'"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" width="100" />
                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item label="Role" name="role">
              <a-radio-group v-model:value="userForm.role">
                <a-radio :value="0">Student</a-radio>
                <!-- <a-radio :value="1">Admin</a-radio> -->
                <a-radio :value="2">tutor</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="Verify" name="disabled">
              <a-radio-group v-model:value="userForm.disabled">
                <a-radio :value="true">Yes</a-radio>
                <!-- <a-radio :value="1">Admin</a-radio> -->
                <a-radio :value="false">No</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-modal>
      </a-layout>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, inject } from "vue";
import { useStore } from "vuex";
import { deleteUser, addUser, updateUser } from "@/api/user";
export default {
  setup() {
    const message = inject("message");
    const store = useStore();
    const searchText = ref("");
    const visible = ref(false);
    const modalTitle = ref("Add User");
    const loading = ref(false);
    const imageUrl = ref("");
    const apiUrl = import.meta.env.VITE_DEV_API_BASE_URL;
    const userForm = ref({
      username: "",
      email: "",
      studentID: "",
      password: "",
      author: "",
      disabled:true,
      role: 0,
    });
    const userFormRef = ref(null);
    const rules = {
      username: [{ required: true, message: "please enter correct username", trigger: "blur" }],
      email: [{ required: true, message: "please enter correct email", trigger: "blur" }],
    };
    const columns = [
      {
        title: "username",
        dataIndex: "username",
        key: "username",
        scopedSlots: { customRender: "username" },
      },
      {
        title: "email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "studentID",
        dataIndex: "studentID",
        key: "studentID",
      },
      {
        title: "author",
        dataIndex: "author",
        key: "author",
      },
      {
        title: "role", //用户角色（如：'0:student', '1:admin'）
        dataIndex: "role",
        key: "role",
      },
      {
        title: "Verify", //用户角色（如：'0:student', '1:admin'）
        dataIndex: "disabled",
        key: "disabled",
      },
      {
        title: "operation",
        dataIndex: "operation",
        key: "operation",
      },
    ];

    const showModal = () => {
      visible.value = true;
      userForm.username = "";
      userForm.email = "";
      userForm.studentID = "";
      userForm.password = "";
      userForm.author = "";
      userForm.role = 0;
      userForm.disabled = true;
      imageUrl = "";
    };

    const handleOk = () => {
      userFormRef.value
        .validate()
        .then(() => {
          // const method = userForm._id ? updateUser : addUser;
          if (userForm.value._id) {
            let upUser = {
              username: userForm.value.username,
              email: userForm.value.email,
              password: userForm.value.password,
              studentID: userForm.value.studentID,
              author: userForm.value.author,
              role: userForm.value.role,
              disabled: userForm.value.disabled,
            };
            updateUser(userForm.value._id, upUser).then((res) => {
              if (res.code === 200) {
                message.success("Operation successful");
                visible.value = false;
                store.dispatch("user/fetchUsers");
              }
            });
          } else {
            addUser(userForm.value).then((res) => {
              if (res.code === 200) {
                message.success("Operation successful");
                visible.value = false;
                store.dispatch("user/fetchUsers");
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleCancel = () => {
      visible.value = false;
      // 清除校验状态
      if (userFormRef.value) {
        userFormRef.value.resetFields();
      }
    };

    const editUser = (record) => {
      Object.assign(userForm.value, record);
      if (record.author) {
        imageUrl.value = apiUrl + record.author;
      } else {
        imageUrl.value = "";
      }
      visible.value = true;
    };

    const deleteItem = (id) => {
      deleteUser(id).then(() => {
        message.success("Delete successful");
        store.dispatch("user/fetchUsers");
      });
    };

    const handleSearch = (value) => {
      searchText.value = value;
    };

    const filteredUsers = computed(() =>
      searchText.value
        ? store.state.user.users.filter((item) =>
            item.username.includes(searchText.value)
          )
        : store.state.user.users
    );

    onMounted(() => {
      store.dispatch("user/fetchUsers");
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
        Object.assign(userForm.value, { author: info.file.response.file.path });
      }
      if (info.file.status === "error") {
        loading.value = false;
        Object.assign(userForm.value, { author: "" });
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
      columns,
      filteredUsers,
      showModal,
      handleOk,
      handleCancel,
      editUser,
      deleteItem,
      handleSearch,
      searchText,
      visible,
      userForm,
      userFormRef,
      rules,
      modalTitle,
      beforeUpload,
      handleChange,
      loading,
      imageUrl,
      apiUrl,
    };
  },
};
</script>

<style lang="scss" scoped>
.views-chart {
  // width: 300px;
  background-color: #fff;
  padding: 10px 20px;
  width: 100%;
  height: calc(100vh - 100px);
  border-radius: 25px;
}
.user-list-layout {
  background-color: #fff;
  margin: 16px;
  padding: 16px;
}

h1 {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.85);
}

a-button {
  margin-right: 8px;
}

a-input-search {
  margin-right: 16px;
}
</style>
