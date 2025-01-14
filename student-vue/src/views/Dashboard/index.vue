<template>
  <div style="background-color: #f5f5f5">
    <div class="views-chart">
      <div class="title">My sessions</div>
      <div class="container">
        <div class="left">
          <div v-if="allCourses.length" class="sessions-item" v-for="item in allCourses" :key="item._id">
            <img class="img" src="../../assets/img/student.png" alt="" />
            <div class="box">
              <div class="title">
                <p class="p1">{{ item.title }}</p>
                <p class="p2">{{ item.location }}</p>
                <p class="p3">{{ dayjs(item.startWeek).format('YYYY-MM-DD HH:mm') }}</p>
                <p class="p4">{{ item.teacher }}</p>
              </div>
              <img src="../../assets/img/chart.png" alt="" />
            </div>
          </div>
          <div v-else style="
              height: 500px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            ">
            <a-empty description="no data" />
          </div>
        </div>
        <div class="right">
          <Calendar @greet="handleGreet" />
          <div class="today-session">
            <h4>Today's Session</h4>
            <div v-if="todayCourses.length" class="box-session" v-for="item in todayCourses" :key="item._id">
              <a-card style="width: 492px" class="card">
                <p>
                  <span>{{ item.title }}</span>
                  <span>{{ item.location }}</span>
                </p>
                <p class="b-s-item">
                  <span>
                    <img src="../../assets/img/chart.png" alt="" />
                    {{ item.teacher }}
                  </span>
                  <span>{{ dayjs(item.startWeek).format('YYYY-MM-DD HH:mm') }}</span>
                </p>
              </a-card>
            </div>
            <a-empty v-else description="no data" />

            <h4>Upcoming Sessions</h4>
            <div v-if="futureCourses.length" class="box-session" v-for="item in futureCourses" :key="item._id">
              <a-card style="width: 492px" class="card">
                <p>
                  <span>{{ item.title }}</span>
                  <span>{{ item.location }}</span>
                </p>
                <p class="b-s-item">
                  <span>
                    <img src="../../assets/img/chart.png" alt="" />
                    {{ item.teacher }}
                  </span>
                  <span>{{ dayjs(item.startWeek).format('YYYY-MM-DD HH:mm') }}</span>
                </p>
              </a-card>
            </div>
            <a-empty v-else description="no data" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import Calendar from "./components/Calendar.vue";
import { myBooking } from "@/api/data";
import { onMounted, ref } from "vue";

const allCourses = ref([]);
const todayCourses = ref([]);
const futureCourses = ref([]);
const handleGreet = (date,) => {
  todayCourses.value = allCourses.value.filter(it => {
    let start = it.startWeek.slice(5, 10)
    if (start === date) {
      return it
    }
  })
}
onMounted(() => {
  myBooking().then((res) => {
    console.log(res);
    if (res.code === 200) {
      allCourses.value = res.data.allCourses;
      todayCourses.value = res.data.todayCourses.slice(0, 3);
      futureCourses.value = res.data.futureCourses.slice(0, 3);
    }
  });
});
</script>

<style lang="scss">
.views-chart {
  // width: 300px;
  background-color: #fff;
  padding: 10px 20px;
  width: 100%;
  height: calc(100vh - 100px);
  border-radius: 25px;

  .title {
    font-size: 24px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .left {
      width: 82%;
      min-width: 800px;
      margin-right: 3%;
      height: calc(100vh - 200px);
      overflow-y: scroll;

      .sessions-item {
        padding: 10px 0;
        height: 24%;
        // background: red;
        border: 1px solid #333;
        border-radius: 25px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-self: center;

        .box {
          display: flex;
          flex-direction: row;

          .title {
            p {
              text-align: center;
              padding: 0;
              margin: 0;

              &.p1 {
                font-size: 30px;
                color: #000;
              }

              &.p2 {
                font-size: 24px;
                color: #333;
              }

              &.p3 {
                font-size: 24px;
                color: #333;
              }

              &.p4 {
                font-size: 24px;
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

      .sessions-item:nth-child(4n + 1) {
        background-color: #b8c4d4;
      }

      .sessions-item:nth-child(4n + 2) {
        background-color: #d1eab0;
      }

      .sessions-item:nth-child(4n + 3) {
        background-color: #ffb689;
      }

      .sessions-item:nth-child(4n + 4) {
        background-color: #fdcf00;
      }
    }

    .right {
      position: relative;

      .box-session {
        margin-bottom: 15px;

        .ant-card-body {
          padding: 0;
        }

        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;

          p {
            margin: 10px 0;
            width: 452px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            img {
              width: 20px;
              height: 20px;
              vertical-align: middle;
              margin-right: 5px;
              position: relative;
              top: -3px;
            }
          }
        }
      }
    }
  }
}
</style>
