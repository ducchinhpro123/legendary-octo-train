import React, { createContext, useContext, useState, useEffect } from 'react';
import { userManager } from './authConfig';


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userManager.getUser()
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const onUserLoaded = (user) => setUser(user);
    const onUserUnloaded = () => setUser(null);

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);

  const login = async () => {
    try {
      await userManager.clearStaleState();
      await userManager.signinRedirect();
    } catch (error) {
      console.error("Login error: ", error);
    }
  };

  const logout = async () => {
    try {
      await userManager.signoutRedirect();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback logout method
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const handleLoginCallback = async () => {
    try {
      const user = await userManager.signinCallback();
      console.log(user);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login callback error:', error);
      return null;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    handleLoginCallback,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

