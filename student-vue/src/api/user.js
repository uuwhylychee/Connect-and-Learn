import request from "@/utils/request";

export const loginIn = (data) =>
  request({
    url: "user/login",
    method: "post",
    data,
  });

export const registIn = (data) =>
  request({
    url: "user/regist",
    method: "post",
    data,
  });

// 模拟API调用
export const getfetchUsers = (data = {}) => {
  return request({
    url: "user/all",
    method: "post",
    data,
  });
}

export const addUser = (data) => {
  return request({
    url: "user/add",
    method: "post",
    data,
  });
}

export const updateUser = (id, data) => {
  return request({
    url: `user/${id}`,
    method: "put",
    data,
  });
}

export const deleteUser = (id) => {
  return request({
    url: `user/${id}`,
    method: "delete",
    data: {}
  });
}
