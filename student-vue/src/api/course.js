import request from "@/utils/request";


// 模拟API调用
export const getfetchCourse = (data = {}) => {
  return request({
    url: "course/all",
    method: "post",
    data,
  });
}

export const addCourse = (data) => {
  return request({
    url: "course/add",
    method: "post",
    data,
  });
}

export const updateCourse = (id, data) => {
  return request({
    url: `course/${id}`,
    method: "put",
    data,
  });
}

export const deleteCourse = (id) => {
  return request({
    url: `course/${id}`,
    method: "delete",
    data: {}
  });
}

export const bookCourse = (data) => {
  return request({
    url: `course/book-course`,
    method: "post",
    data:data
  });
}


