import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

// 获取token
export function getToken(): string | undefined {
  return Cookies.get(TokenKey);
}

// 设置token
export function setToken(token: string): string | undefined {
  return Cookies.set(TokenKey, token);
}

// 删除token
export function removeToken() {
  return Cookies.remove(TokenKey);
}
