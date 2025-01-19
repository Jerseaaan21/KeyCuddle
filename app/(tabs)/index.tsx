import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import KeyCuddle from './content';  // Content component for logged-in users
import App from './login';          // Login/Register component for non-logged-in users
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const auth = getAuth();
    
    // Listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);  // User is logged in
      } else {
        setIsLoggedIn(false); // User is logged out
      }
      setIsLoading(false);  // Stop loading once we have the auth state
    });

    // Cleanup the listener on unmount
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? (
        <KeyCuddle /> // Content component for logged-in users
      ) : (
        <App /> // Login/Register screen for non-logged-in users
      )}
    </View>
  );
};

export default Index;
