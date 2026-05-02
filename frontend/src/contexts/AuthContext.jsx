import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authAPI from '../services/authAPI';
import * as tokenStorage from '../services/tokenStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(tokenStorage.getSessionToken());
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getSessionToken();
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data);
          setIsGuest(false);
          setSessionToken(token);
        } catch (error) {
          console.error("Session restoration failed", error);
          tokenStorage.clearSession();
          setSessionToken(null);
          setUser(null);
          setIsGuest(true);
        }
      } else {
        setIsGuest(true);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { sessionToken: token, ...userData } = response.data;
    
    tokenStorage.setSessionToken(token);
    setSessionToken(token);
    setUser(userData);
    setIsGuest(false);
    
    // Trigger color shift (to be handled by components/layout)
    document.documentElement.style.setProperty('--user-crystal-color', userData.crystalHexCode);
    
    return response.data;
  };

  const signup = async (email, password) => {
    const response = await authAPI.signupInitiate(email, password);
    return response.data;
  };

  const verifySignup = async (email, code) => {
    const response = await authAPI.signupVerify(email, code);
    const { sessionToken: token } = response.data;
    
    tokenStorage.setSessionToken(token);
    setSessionToken(token);
    // Fetch full user data after verification
    const userResponse = await authAPI.getMe();
    setUser(userResponse.data);
    setIsGuest(false);
    
    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      console.error("Logout API failed, clearing local session anyway");
    }
    tokenStorage.clearSession();
    setSessionToken(null);
    setUser(null);
    setIsGuest(true);
  };

  const updatePreferences = async (prefs) => {
    const response = await authAPI.updatePreferences(prefs);
    setUser(prev => ({ ...prev, preferences: response.data }));
    return response.data;
  };

  const deleteAccount = async () => {
    await authAPI.deleteAccount("permanently erase");
    tokenStorage.clearSession();
    setSessionToken(null);
    setUser(null);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      sessionToken,
      isLoading,
      isGuest,
      login,
      signup,
      verifySignup,
      logout,
      updatePreferences,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
