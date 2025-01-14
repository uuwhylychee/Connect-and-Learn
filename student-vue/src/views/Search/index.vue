<template>
  <div style="background-color: #f5f5f5">
    <div class="views-chart">
      <a-layout class="search-courses">
        <div class="top">
          <SearchOutlined
            style="margin: 10px 10px 0 0; float: left; font-size: 30px"
          />
          <a-input-search
            placeholder="Please enter the course name for the search"
            v-model:value="searchText"
            @search="onSearch"
            style="width: 300px; margin: 10px 0; float: left"
          >
            <template #enterButton>
              <EnterOutlined />
            </template>
          </a-input-search>
        </div>
        <a-layout-content style="overflow-y: scroll">
          <div class="title">All sessions</div>
          <div class="sessions-box">
            <div
              v-if="filteredCourse.length"
              class="sessions-item"
              v-for="(item, index) in filteredCourse"
              :key="item.id"
            >
              <div style="width: 100px; text-align: center; padding-top: 15px">
                <img
                  v-show="index % 2 == 0"
                  class="img"
                  style="width: 100px; height: 100px; border-radius: 50%"
                  src="../../assets/img/Group 2465.png"
                  alt=""
                />
                <img
                  v-show="index % 2 != 0"
                  class="img"
                  style="width: 100px; height: 100px; border-radius: 50%"
                  src="../../assets/img/women.png"
                  alt=""
                />
                <div style="font-size: 28px; margin-top: 15px">
                  {{ item.teacher }}
                </div>
              </div>
              <div class="box">
                <div class="title">
                  <p class="p1">{{ item.title }}</p>
                  <p class="p2">Location:{{ item.location }}</p>
                  <p class="p3">time:{{ item.startWeek }}</p>
                  <p class="p4">Duration:{{ item.endWeek }}</p>
                </div>
                <!-- <img src="../../assets/img/chart.png" alt="" /> -->
              </div>
              <div
                style="
                  cursor: pointer;
                  margin-top: 120px;
                  font-size: 20px;
                  font-weight: bold;
                  background: #d0eaad;
                  color: #fff;
                  width: 150px;
                  height: 40px;
                  line-height: 40px;
                  border-radius: 20px;
                  text-align: center;
                "
                @click="appointmentCourse(item)"
              >
                SIGN UP
              </div>
              <!-- <PlusCircleOutlined style="font-size: 100px;color:#004080" @click="appointmentCourse(item)" /> -->
            </div>
            <div
              v-else
              style="
                height: 500px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <a-empty description="no data" />
            </div>
          </div>
        </a-layout-content>
      </a-layout>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from "vue";
import {
  SearchOutlined,
  EnterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { bookCourse } from "@/api/course";
import { useStore } from "vuex";
const searchText = ref("");
const store = useStore();
const message = inject("message");

const onSearch = (value) => {
  searchText.value = value;
};
// function onSearch(value) {
//   // 这里应该调用API获取课程数据，这里只是示例
//   searchText.value = value;
//   fetchCourses(value).then((data) => {
//     courses.value = data;
//   });
// }
// async function fetchCourses(query) {
//   // 模拟API请求，实际开发中应替换为真实的API调用
//   const response = await fetch(`/api/courses?search=${query}`);
//   const data = await response.json();
//   return data;
// }
const filteredCourse = computed(() =>
  searchText.value
    ? store.state.course.course.filter((item) =>
        item.title.includes(searchText.value)
      )
    : store.state.course.course
);

const appointmentCourse = (item) => {
  let data = {
    courseId: item._id,
  };
  bookCourse(data).then((res) => {
    if (res.code === 200) {
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
  });
};
onMounted(() => {
  store.dispatch("course/fetchCourse");
});
</script>

<style lang="scss" scoped>
.views-chart {
  // width: 300px;
  background-color: #b8c4d4;
  padding: 10px 20px;
  width: 100%;
  height: calc(100vh - 100px);
  border-radius: 25px;
  .search-courses {
    background-color: #b8c4d4;
    padding: 16px;
    .top {
      border-bottom: 1px solid #ddd;
      margin-bottom: 15px;
    }
    .sessions-box {
      // display: flex;
      // flex-direction: row;
      // justify-content: space-between;
      .sessions-item {
        padding: 10px 0;
        width: 49%;
        height: 200px;
        // background: red;
        border: 1px solid #333;
        border-radius: 20px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-self: center;
        float: left;
        margin: 5px;
        .box {
          display: flex;
          flex-direction: row;
          .title {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            p {
              text-align: left;
              margin: 0;
              &.p1 {
                font-size: 20px;
                color: #000;
              }
              &.p2 {
                font-size: 20px;
                color: #333;
              }
              &.p3 {
                font-size: 18px;
                color: #333;
              }
              &.p4 {
                font-size: 16px;
                color: #666;
              }
            }
          }
          img {
            width: 40px;
            height: 40px;
            align-self: flex-end;
          }
        }
      }
    }
  }
}
</style>
