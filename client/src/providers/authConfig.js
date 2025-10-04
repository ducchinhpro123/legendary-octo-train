import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

// const redirectUri = process.env.REACT_APP_REDIRECT_URI || "http://localhost:5173/callback";
const redirectUri = window.location.origin + "/callback";
const authServerUri = process.env.REACT_APP_AUTH_SERVER_URL || 'http://localhost:8080';

export const authConfig = {
  authority: authServerUri,
  client_id: 'react-client',
  redirect_uri: redirectUri,
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
