<template>
  <div style="background-color: #f5f5f5">
    <div class="views-chart">
      <a-layout class="user-list-layout">
        <a-row align="middle" justify="space-between" gutter="{16}">
          <a-col>
            <h1>Class Management</h1>
          </a-col>
          <a-col>
            <a-input-search placeholder="search class" v-model:value="searchText" @search="handleSearch"
              style="width: 200px; margin-right: 20px" />
            <a-button type="primary" @click="showModal">add Class</a-button>
          </a-col>
        </a-row>
        <a-layout-content class="user-list-content">
          <a-table :columns="columns" :dataSource="filteredCourse" rowKey="id" bordered>
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'role'">
                <div>
                  {{ record.role === 0 ? "Student" : "Admin" }}
                </div>
              </template>
              <template v-if="column.dataIndex === 'startWeek'">
                <div>
                  {{ formattedDate(record.startWeek) }}
                </div>
              </template>
              
               <template v-if="column.dataIndex === 'endWeek'">
                <div>
                  {{ formattedDate(record.endWeek) }}
                </div>
              </template>
              <template v-if="column.dataIndex === 'createdAt'">
                <div>
                  {{ formattedDate(record.createdAt) }}
                </div>
              </template>
              
              <template v-if="column.dataIndex === 'author'">
                <div>
                  <a-image style="border-radius: 50%" v-if="record.author" :width="40" :height="40"
                    :src="apiUrl + record.author" />
                </div>
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <a-button type="primary" @click="editCoruse(record)">edit</a-button>
                <a-popconfirm v-if="filteredCourse.length" title="Sure to delete?" @confirm="deleteItem(record._id)">
                  <a-button type="delete">delete</a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </a-layout-content>
        <!-- 用户表单模态框 -->
        <a-modal v-model:open="visible" :title="modalTitle" @ok="handleOk" @cancel="handleCancel">
          <a-form :model="courseForm" name="basic" ref="courseFormRef" :rules="rules" :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }" autocomplete="off">
            <a-form-item label="title" name="title">
              <a-input v-model:value="courseForm.title" />
            </a-form-item>
            <a-form-item label="description" name="description">
              <a-input v-model:value="courseForm.description" />
            </a-form-item>
            <a-form-item label="teacher" name="teacher">
              <a-input v-model:value="courseForm.teacher" />
            </a-form-item>

            <!-- <a-form-item label="startTime" name="startTime">
              <a-date-picker v-model:value="courseForm.startTime" show-time valueFormat="YYYY-MM-DD HH:mm:ss" />
            </a-form-item>
            <a-form-item label="endTime" name="endTime">
              <a-date-picker v-model:value="courseForm.endTime" show-time valueFormat="YYYY-MM-DD HH:mm:ss" />
            </a-form-item> -->
            <a-form-item label="startWeek" name="startWeek">
              <a-date-picker v-model:value="courseForm.startWeek" format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" show-time/>
              <!-- <a-week-picker v-model:value="courseForm.startWeek" valueFormat="YYYY-MM-DD HH:mm:ss"/> -->
            </a-form-item>
            <a-form-item label="endWeek" name="endWeek">
              <a-date-picker v-model:value="courseForm.endWeek" :disabled-date="disabledDate"  format="YYYY-MM-DD HH:mm:ss" show-time/>
              <!-- <a-week-picker v-model:value="courseForm.endWeek"  valueFormat="YYYY-MM-DD HH:mm:ss"/> -->
            </a-form-item>
            <a-form-item label="isRecurring" name="isRecurring">
              <a-radio-group v-model:value="courseForm.isRecurring">
                <a-radio :value="true">true</a-radio>
                <a-radio :value="false">false</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="courseForm.isRecurring" label="Recurring Week" name="weeks">
              <a-checkbox-group v-model:value="courseForm.weeks" style="width: 100%">
                <a-row>
                  <a-col :span="8">
                    <a-checkbox value="1">Monday</a-checkbox>
                  </a-col>
                  <a-col :span="8">
                    <a-checkbox value="2">Tuesday</a-checkbox>
                  </a-col>
                  <a-col :span="8">
                    <a-checkbox value="3">wednesday</a-checkbox>
                  </a-col>
                  <a-col :span="8">
                    <a-checkbox value="4">Thursday</a-checkbox>
                  </a-col>
                  <a-col :span="8">
                    <a-checkbox value="5">Friday</a-checkbox>
                  </a-col>
                  <a-col :span="8">
                    <a-checkbox value="6">Saturdays</a-checkbox>
                  </a-col>
                  <a-col :span="8">
                    <a-checkbox value="7">Sunday</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item label="location" name="location">
              <a-input v-model:value="courseForm.location" />
            </a-form-item>
            <a-form-item label="maxStudents" name="maxStudents">
              <a-input-number v-model:value="courseForm.maxStudents" :min="1" />
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
import { deleteCourse, addCourse, updateCourse } from "@/api/course";
import moment from 'moment';
import dayjs from 'dayjs'

export default {
  setup() {
    const message = inject("message");
    const store = useStore();
    const searchText = ref("");
    const visible = ref(false);
    const modalTitle = ref("Add Class");
    const loading = ref(false);
    const imageUrl = ref("");
    const apiUrl = import.meta.env.VITE_DEV_API_BASE_URL;
    const courseForm = ref({
      title: "",
      description: "",
      teacher: "",
      // startTime: null,
      // endTime: null,
      startWeek: null,
      endWeek: null,
      isRecurring: false,
      location: "",
      maxStudents: 1,
      bookedBy: [],
      weeks: ''
    });
    const courseFormRef = ref(null);
    const rules = {
      title: [
        { required: true, message: "Please enter the title!", trigger: "blur" },
      ],
      description: [
        {
          required: true,
          message: "Please enter the description!",
          trigger: "blur",
        },
      ],
      teacher: [
        {
          required: true,
          message: "Please enter the teacher!",
          trigger: "blur",
        },
      ],
      startWeek: [
        {
          required: true,
          message: "Please enter the startWeek!",
          trigger: "blur",
        },
      ],
      endWeek: [
        {
          required: true,
          message: "Please enter the endWeek!",
          trigger: "blur",
        },
      ],
      location: [
        {
          required: true,
          message: "Please enter the location!",
          trigger: "blur",
        },
      ],
      maxStudents: [
        {
          required: true,
          message: "Please enter the maxStudents!",
          trigger: "blur",
        },
      ],
    };

    const columns = [
      {
        title: "title",
        dataIndex: "title",
        key: "title",
        scopedSlots: { customRender: "title" },
      },
      {
        title: "description",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "teacher",
        dataIndex: "teacher",
        key: "teacher",
      },
      {
        title: "startWeek",
        dataIndex: "startWeek",
        key: "startWeek",
      },
      {
        title: "endWeek",
        dataIndex: "endWeek",
        key: "endWeek",
      },
      {
        title: "createdAt",
        dataIndex: "createdAt",
        key: "createdAt",
      },
      {
        title: "location", //用户角色（如：'0:student', '1:admin'）
        dataIndex: "location",
        key: "location",
      },
      {
        title: "maxStudents", //用户角色（如：'0:student', '1:admin'）
        dataIndex: "maxStudents",
        key: "maxStudents",
      },
      // {
      //   title: "bookedBy",
      //   dataIndex: "bookedBy",
      //   key: "bookedBy",
      // },
      {
        title: "operation",
        dataIndex: "operation",
        key: "operation",
      },
    ];

    const showModal = () => {
      visible.value = true;
      courseForm.title = "";
      courseForm.description = "";
      courseForm.teacher = "";
      courseForm.startWeek = null;
      courseForm.endWeek = null;
      courseForm.location = "";
      courseForm.maxStudents = 1;
      courseForm.bookedBy = [];
      courseForm.weeks = []
    };

    const handleOk = () => {
      courseFormRef.value
        .validate()
        .then(() => {
          const formData = {
            ...courseForm.value,
            startWeek: dayjs(courseForm.value.startWeek).format('YYYY-MM-DD HH:mm:ss'),
            endWeek: dayjs(courseForm.value.startWeek).format('YYYY-MM-DD HH:mm:ss'),
            weeks: courseForm.value.weeks.toString()
          }

          // const method = courseForm._id ? updateUser : addUser;
          if (courseForm.value._id) {
            updateCourse(courseForm.value._id, formData).then((res) => {
              if (res.code === 200) {
                message.success("Operation successful");
                visible.value = false;
                store.dispatch("course/fetchCourse");
              }
              courseForm.value = {}
            });
          } else {
            // courseForm.value.startWeek = moment(courseForm.value.startWeek, 'YYYY-ww');
            // courseForm.value.endWeek = moment(courseForm.value.endWeek, 'YYYY-ww');
            addCourse(formData).then((res) => {
              if (res.code === 200) {
                message.success("Operation successful");
                visible.value = false;
                store.dispatch("course/fetchCourse");
              }
            });
            courseForm.value = {}
          }
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

    const editCoruse = (record) => {
      courseForm.value = {
        ...record,
        startWeek: dayjs(record.startWeek),
        endWeek: dayjs(record.endWeek),
        weeks: record.weeks.split(',')
      }
      visible.value = true;
    };

    const disabledDate = (current) => {
      console.log(current)
      // Can not select days before today and today
      return current && current < dayjs().subtract(1, 'day').endOf('day');
    };

    const deleteItem = (id) => {
      deleteCourse(id).then(() => {
        message.success("Delete successful");
        store.dispatch("course/fetchCourse");
      });
    };

    const handleSearch = (value) => {
      searchText.value = value;
    };

    const filteredCourse = computed(() =>
      searchText.value
        ? store.state.course.course.filter((item) =>
          item.title.includes(searchText.value)
        )
        : store.state.course.course
    );

    onMounted(() => {
      store.dispatch("course/fetchCourse");
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
        Object.assign(courseForm.value, {
          author: info.file.response.file.path,
        });
      }
      if (info.file.status === "error") {
        loading.value = false;
        Object.assign(courseForm.value, { author: "" });
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

    const formattedDate =(v)=>{
      return moment(v).format("YYYY-MM-DD HH:mm:ss")
    };
    return {
      formattedDate,
      columns,
      filteredCourse,
      showModal,
      handleOk,
      handleCancel,
      editCoruse,
      deleteItem,
      handleSearch,
      searchText,
      visible,
      courseForm,
      courseFormRef,
      rules,
      modalTitle,
      beforeUpload,
      handleChange,
      loading,
      imageUrl,
      apiUrl,
      disabledDate
    };
  },
};
</script>

<style lang="scss">
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
