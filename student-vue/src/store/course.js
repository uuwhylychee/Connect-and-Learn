import { getfetchCourse,updateCourse, addCourse, deleteCourse } from "@/api/course";

const state = {
    course: [],
}
const getters = {
    course: () => {
        return state.course
    },
}
const mutations = {
    setCourse(state, course) {
        state.course = course;
    }
}
const actions = {
    fetchCourse({ commit }) {
        getfetchCourse().then((course) => {
            commit('setCourse', course.data);
        });
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
