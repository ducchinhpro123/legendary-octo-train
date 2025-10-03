import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

export const authConfig = {
  authority: 'http://localhost:8080',
  client_id: 'react-client',
  redirect_uri: 'http://localhost:5173/callback',
  post_logout_redirect_uri: 'http://localhost:5173',
  response_type: 'code',
  scope: 'openid profile read',
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
  monitorSession: false,
  loadUserInfo: true,
}

export const userManager = new UserManager(authConfig);

userManager.events.addSilentRenewError((e) => {
  console.error('Silent renew error: ', e);
});

userManager.events.addAccessTokenExpiring(() => {
  console.log('Access token about to expire');
});

userManager.events.addAccessTokenExpired(() => {
  console.log('Access token expired');
});
