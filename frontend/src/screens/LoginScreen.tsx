import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput, 
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:5005/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', token);

      Alert.alert('Welcome', `Logged in as ${user.name}`);

      // You can navigate to Dashboard/Home here:
      // navigation.navigate('Home'); // <- add this when Home screen is ready
     
     
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

      
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#004B8D" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">


          <Text style={styles.title}>Welcome to SiFAST</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.forgotText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F4F7' },
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  innerContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: { width: 180, height: 80, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '600', color: '#004B8D', marginBottom: 40 },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: '#004B8D',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  forgotText: {
    marginTop: 20,
    color: '#00AEEF',
    fontSize: 14,
  },
});

export default LoginScreen;
