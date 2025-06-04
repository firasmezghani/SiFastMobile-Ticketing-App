import React, { useState } from 'react';
import {
  View,
  Text, 
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }
  
    console.log("📤 Sending signup data:", { name, email, password });
  
    try {
      const response = await axios.post('http://192.168.0.82:5005/api/auth/signup', {
        name,
        email,
        password,
      });
      
      const { token, user } = response.data;
      
  
      await AsyncStorage.setItem('token', token);
  
      Alert.alert('Welcome', `Account created for ${user.name}`);
  
      // ✅ Navigate to Home and reset navigation history
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
  
    } catch (error: any) {
      console.error("❌ Signup error:", error?.response?.data || error.message);
      Alert.alert("Error", error?.response?.data?.message || "Signup failed");
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
          <Text style={styles.title}>Create an Account</Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={setName}
            value={name}
          />

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

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Already have an account? Log in</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#004B8D',
    marginBottom: 40,
  },
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
  signupButton: {
    backgroundColor: '#004B8D',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  loginLink: {
    marginTop: 20,
    color: '#00AEEF',
    fontSize: 14,
  },
});

export default SignupScreen;
