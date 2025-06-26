import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

const PortalKey = 'Portal-Token'

// 获取token
export function getToken(): string | undefined {
  return Cookies.get(TokenKey);
}

// 设置token
export function setToken(token: string): void {
  return Cookies.set(TokenKey, token);
}

// 删除token
export function removeToken() {
  return Cookies.remove(TokenKey);
}

// 获取portalToken
export function getPortalToken(): string | undefined {
  return Cookies.get(PortalKey);
}

// 设置portalToken
export function setPortalToken(token: string): void {
  return Cookies.set(PortalKey, token);
}

// 删除portalToken
export function removePortalToken() {
  return Cookies.remove(PortalKey);
}
