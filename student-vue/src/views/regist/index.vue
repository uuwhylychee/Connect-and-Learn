<template>
  <div class="bg">
    <div class="regist">
    <div class="login-form-content">
      <div class="login-form">
        <div class="topimg">
            <h2 class="title">Connect & Learn</h2>
            <img class="top" src="../../assets/img/top2.png" alt="">
            <!-- <img class="top" src="../../assets/img/top3.png" alt=""> -->
          </div>
        <!-- <h2 class="title">Register</h2> -->
        <a-form layout="vertical">
          <a-form-item v-bind="validateInfos.username" label="Full Name" label-width="400px">
            <a-input v-model:value="loginForm.username" placeholder="" />
          </a-form-item>
          <a-form-item v-bind="validateInfos.studentID" label="User Name" label-width="400px">
            <a-input v-model:value="loginForm.studentID" placeholder="" />
          </a-form-item>
          <a-form-item v-bind="validateInfos.email" label="Ntu Email" label-width="400px">
            <a-input v-model:value="loginForm.email" placeholder="" />
          </a-form-item>
          <a-form-item v-bind="validateInfos.password" label="Password" label-width="400px">
            <a-input v-model:value="loginForm.password" type="password" placeholder="" />
          </a-form-item>
          <a-form-item v-bind="validateInfos.password2" label="Repeat Password" label-width="400px">
            <a-input v-model:value="loginForm.password2" type="password" placeholder="" />
          </a-form-item>
        </a-form>
        <div class="login-form-operations">
          <a-button block type="primary" @click.prevent="handleSubmit">
            Register
          </a-button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script setup>
import { reactive, toRaw,inject } from 'vue'
import { Form } from 'ant-design-vue'
import { useRouter } from 'vue-router'

import { registIn } from '@/api/user'
import { useStore } from 'vuex'
const useForm = Form.useForm
const router = useRouter()
const store = useStore()
const message = inject("message");
const loginForm = reactive({
  username: '',
  studentID: '',
  email: '',
  password: '',
  password2: '',
})



const { resetFields, validate, validateInfos } = useForm(
  loginForm,
  reactive({
    username: [
      {
        required: true,
        message: 'Please enter the Full Name',
      },
    ],
    studentID: [
      {
        required: true,
        message: 'Please enter the Matrix Number',
      },
    ],
    email: [
      {
        required: true,
        message: 'Please enter the Ntu Emaiil',
      },
    ],
    password: [
      {
        required: true,
        message: 'Please enter the Password',
      },
    ],
    password2: [
      {
        required: true,
        message: 'Please enter the Repeat Password',
      },
    ],
  })
)
const handleSubmit = () => {
  validate()
    .then((res) => {
      //模拟假登录
      // let auth = res.username
      // store.commit('auth/GENERATE_ROUTES', auth)
      // store.commit('auth/SET_AUTH', auth)
      // router.push('/home')
      registIn(toRaw({
        username: loginForm.username,
        email: loginForm.email,
        studentID: loginForm.studentID,
        password: loginForm.password,
      }))
        .then((res) => {
          const { code } = res
          if(code === 200){
            message.success("register successfully");
            router.push('/login')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log('error', err)
    })
}
const handleReset = () => {
  resetFields()
}
</script>

<style lang="scss">
.bg {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/img/bg.png") no-repeat 100% 100%;
  background-size: cover;
}
.regist {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);

  .login-header {
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    border: 1px solid #e8e8e8;

    .lang-menu {
      margin-right: 30px;
    }
  }

  .login-form-content {
    height: calc(100% - 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    .topimg{
      display: flex;
      flex-direction:column;
      align-items: center;
      .title{
        text-align: center;
        margin-bottom:0;
      }
      .top{
        width:200px;
      }
    }

    .login-form {
      width: 300px;
      // height: 290px;
      border: 1px solid #f1efef;
      border-radius: 4px;
      padding: 40px;
      background: rgba(255, 255, 255);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);

      .title {
        text-align: center;
      }

      .login-control {
        display: flex;
        justify-content: space-between;
      }

      .login-form-operations {
        .ant-btn {
          margin: 8px 0;
        }
      }
    }
  }
}
</style>
