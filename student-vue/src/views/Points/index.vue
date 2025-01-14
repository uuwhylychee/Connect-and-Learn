<template>
  <div class="points" style="background-color: #f5f5f5">
    <div v-show="showModal" class="modal">
      <div style="font-size: 30px">Products</div>
      <a-row :gutter="[20, 20]" style="margin: 50px 0 20px 10px">
        <a-col :span="8" v-for="(item, index) in modalData" :key="index">
          <div style="
              width: 100%;
              height: 300px;
              border-raius: 20px;
              background: #fff;
              text-align: center;
              margin-top: 20px;
            ">
            <div style="font-size: 26px; color: #777; line-height: 100px">
              {{ item.name }}
            </div>
            <img style="width: 100px; height: 100px" :src="item.img" alt="" />
            <div style="font-size: 36px; color: #000; line-height: 100px">
              Points {{ item.points }}
            </div>
            <a-checkbox @click="handChecked($event, index)" style="transform: scale(4); margin-top: 50px"
              v-model:checked="item.checked"></a-checkbox>
          </div>
        </a-col>
      </a-row>
      <div @click="handlePoints" style="
          font-size: 20px;
          width: 200px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 20px;
          position: fixed;
          right: 50px;
          bottom: 50px;
          background: #ff6300;
          color: #000;
          cursor: pointer;
        ">
        Redeem
      </div>
    </div>
    <div class="card">
      <div style="font-size: 30px">Achievement of points</div>
      <a-row :gutter="[20, 20]" style="margin: 20px 0 20px -10px">
        <a-col :span="12"><a-card style="width: 100%; height: 200px; float: left">
            <img class="img img1" src="../../assets/img/jifen1.png" alt="" />
            <div class="txt">Total Points</div>
            <div class="txt">{{ doneCourses.length }}</div>
          </a-card></a-col>
        <a-col :span="12"><a-card style="width: 100%; height: 200px; float: left">
            <img class="img" src="../../assets/img/jifen2.png" alt="" />
            <div class="txt">Good!</div>
            <div class="txt" v-if="doneCourses.length === 0 && allCourses.length === 0">
              0%
            </div>
            <div class="txt" v-else>
              {{ (doneCourses.length / allCourses.length) * 100 }}%
            </div>
          </a-card></a-col>
      </a-row>
      <div style="font-size: 30px">All Achievement</div>
      <a-row style="margin-top: 20px" :gutter="[20, 20]">
        <div class="left">
          <img class="img" style="margin-right: 20px" src="../../assets/img/jifen3.png" alt="" />
          <p>level 1</p>
        </div>
        <div style="float: left; width: calc(100% - 200px)">
          <div style="font-size: 30px; width: 50%; margin-bottom: 30px">
            Wild Fire
            <span style="float: right"><span style="color: red">{{
              doneCourses.length > 3 ? 3 : doneCourses.length
            }}</span>/3</span>
          </div>
          <a-progress strokeColor="#D1EAB0" trailColor="#D9D9D9" :showInfo="false" :size="[300, 20]"
            style="width: 50%; margin-bottom: 30px" :percent="doneCourses.length > 3
                ? (3 / 3) * 100
                : (doneCourses.length / 3) * 100
              " />
          <div style="font-size: 30px; width: 50%">
            Attended
            <span style="color: red">{{
              doneCourses.length > 3 ? 3 : doneCourses.length
            }}</span>
            sessions
          </div>
        </div>
      </a-row>
      <a-row style="margin-top: 20px" :gutter="[20, 20]">
        <div class="left">
          <img class="img" style="margin-right: 20px" src="../../assets/img/jifen4.png" alt="" />
          <p>level 2</p>
        </div>
        <div style="float: left; width: calc(100% - 200px)">
          <div style="font-size: 30px; width: 50%; margin-bottom: 30px">
            Apprentice
            <span style="float: right"><span style="color: red">{{
              doneCourses.length > 15 ? 15 : doneCourses.length
            }}</span>/15</span>
          </div>
          <a-progress strokeColor="#D1EAB0" trailColor="#D9D9D9" :showInfo="false" :size="[300, 20]"
            style="width: 50%; margin-bottom: 30px" :percent="doneCourses.length > 15
                ? (15 / 15) * 100
                : (doneCourses.length / 15) * 100
              " />
          <div style="font-size: 30px; width: 50%">
            Attended
            <span style="color: red">{{
              doneCourses.length > 15 ? 15 : doneCourses.length
            }}</span>
            sessions
          </div>
        </div>
      </a-row>
      <div @click="showModal = !showModal" style="
          font-size: 20px;
          width: 200px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 20px;
          position: fixed;
          right: 50px;
          bottom: 50px;
          background: #acb9bf;
          color: #fff;
        ">
        Redeem
      </div>
    </div>
  </div>
  <a-modal v-model:open="qrcodeModal" title="QR Code" :footer="null" :width="200">
    <a-qrcode ref="qrcodeCanvasRef" :value="pointUrl" />
    <div style="margin-top: 20px; display: flex; justify-content: center">
      <a-button type="primary" @click="dowloadChange">Downlaod</a-button>
    </div>
  </a-modal>
</template>
<script setup>
import { myBooking, pointItem } from "@/api/data";
import { onMounted, ref, inject } from "vue";
const allCourses = ref([]);
const todayCourses = ref([]);
const futureCourses = ref([]);
const doneCourses = ref([]);
const showModal = ref(false);
const message = inject("message");
const modalData = ref([
  {
    name: "Notebook",
    points: 30,
    section: 26,
    img: new URL("../../assets/img/modal2.png", import.meta.url).href,
    checked: false,
  },
  {
    name: "Snacks",
    section: 27,
    points: 20,
    checked: false,
    img: new URL("../../assets/img/modal1.png", import.meta.url).href,
  },
  {
    name: "Pen",
    section: 28,
    points: 10,
    checked: false,
    img: new URL("../../assets/img/modal3.png", import.meta.url).href,
  },
]);
const pointUrl = ref('')
const qrcodeModal = ref(false)
const qrcodeCanvasRef = ref();

const handChecked = (e, index) => {
  // if (doneCourses.value.length < modalData.value[index].points) {
  //   message.error("Not Enough Points")
  //   e.target.checked = false
  //   return
  // } else {
    // modalData.value =
    modalData.value.forEach((it, i) => {
      it.checked = false;
      if (i === index) {
        it.checked = e.target.checked;
      }
    });
  // }
};

const handlePoints = async () => {
  const pointIndex = modalData.value.findIndex((it) => it.checked);
  if (pointIndex === -1) {
    message.error("No item to Point!")
    return
  }

  const result = await pointItem({
    icon: ['671a39d468deb8544714b30d', '671a39b968deb8544714b30c', '671a39ef68deb8544714b30e'][pointIndex],
  })
  pointUrl.value = `${import.meta.env.VITE_HOST}/order/${result.data.orderNum}`
  qrcodeModal.value = true
}

const dowloadChange = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL();
  const a = document.createElement('a');
  a.download = 'Point.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

onMounted(() => {
  myBooking().then((res) => {
    console.log(res);
    if (res.code === 200) {
      allCourses.value = res.data.allCourses;
      todayCourses.value = res.data.todayCourses.slice(0, 3);
      futureCourses.value = res.data.futureCourses.slice(0, 3);
      doneCourses.value = res.data.doneCourses;
    }
  });
});
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

.points {
  position: relative;

  .card {
    width: 100%;
    height: auto;
    min-height: calc(100vh - 100px);
    border-radius: 30px;
    background: #b8c4d4;
    padding: 10px 30px;
  }

  .modal {
    width: calc(100% - 30px);
    min-height: calc(100vh - 100px);
    border-radius: 20px;
    background: #b8c4d4;
    padding: 36px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    -webkit-appearance: none;
    /* 移除默认样式 */
    border: 1px solid #999;
    display: inline-block;
    position: relative;
    cursor: pointer;
  }

  input[type="checkbox"]:checked {
    background-color: #65558f;
    /* 选中颜色 */
  }

  input[type="checkbox"] {
    outline: none;
    /* 移除点击时的轮廓 */
  }
}

img {
  object-fit: cover;
}

.img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  float: left;
}

.img1 {
  width: 100px;
  border-radius: 0;
}

.txt {
  width: calc(100% - 300px);
  float: left;
  font-size: 50px;
  line-height: 80px;
  margin-left: 30px;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 24px;
  }
}
</style>
