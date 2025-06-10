// import { Module } from 'vuex';
// import { RootState } from '../index'; // 我们稍后会创建 RootState
//
// // 定义 user 模块的 state 类型
// export interface UserState {
//   token: string | null;
//   userInfo: Record<string, any> | null;
// }
//
// const userModule: Module<UserState, RootState> = {
//   namespaced: true, // 开启命名空间
//
//   state: (): UserState => ({
//     token: localStorage.getItem('token') || null, // 从 localStorage 初始化 token
//     userInfo: null,
//   }),
//
//   mutations: {
//     SET_TOKEN(state, token: string | null) {
//       state.token = token;
//       if (token) {
//         localStorage.setItem('token', token);
//       } else {
//         localStorage.removeItem('token');
//       }
//     },
//     SET_USER_INFO(state, userInfo: Record<string, any> | null) {
//       state.userInfo = userInfo;
//     },
//   },
//
//   actions: {
//     // 模拟登录
//     async login({ commit }, { username, password }) {
//       // 在真实项目中，这里会调用 API
//       console.log('Login attempt with:', username, password);
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           const mockToken = `mock_token_${Date.now()}`;
//           const mockUserInfo = { name: 'Admin', role: 'admin', email: 'admin@test.com' };
//
//           commit('SET_TOKEN', mockToken);
//           commit('SET_USER_INFO', mockUserInfo);
//           resolve(mockToken);
//         }, 1000);
//       });
//     },
//
//     // 登出
//     logout({ commit }) {
//       commit('SET_TOKEN', null);
//       commit('SET_USER_INFO', null);
//     },
//   },
//
//   getters: {
//     isLoggedIn: (state): boolean => !!state.token,
//     token: (state): string | null => state.token,
//     userInfo: (state): Record<string, any> | null => state.userInfo,
//   },
// };
//
// export default userModule;
