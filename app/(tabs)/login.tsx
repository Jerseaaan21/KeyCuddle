import React, { useState } from 'react';
import { ScrollView, View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Adjust the import path based on your file structure
import Icon from 'react-native-vector-icons/MaterialIcons';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      Alert.alert('Success', 'Login successful!');
      console.log('Logged in user:', user);
    } catch (error: any) {
      Alert.alert('Error', "Account doesn't exist");
      console.error('Login error:', "Account doesn't exist");
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      Alert.alert('Success', 'Registration successful!');
      console.log('Registered user:', user);
      setIsLogin(true); // Switch to login view after successful registration
    } catch (error: any) {
      Alert.alert('Error', error.message);
      console.error('Registration error:', error);
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome! KeyCuddlers</Text>
      </View>

      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

      <Text style={styles.inputSectionTitle}>Please enter your details</Text>

      {/* Register Form Fields */}
      {!isLogin && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullname}
              onChangeText={setFullname}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
        </>
      )}

      {/* Email Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          keyboardType="email-address"
        />
      </View>

      {/* Password Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Icon name={isPasswordVisible ? 'visibility-off' : 'visibility'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={isLogin ? handleLogin : handleRegister}
      >
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>

      {/* Toggle between Login/Registration */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={styles.toggleButtonText}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    padding: 30,
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputSectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  toggleButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default App;
