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

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async () => {
    if (!email || !oldPassword || !newPassword) {
      Alert.alert('Missing Info', 'Please fill all fields.');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:5005/api/auth/forgot-password', {
        email,
        oldPassword,
        newPassword,
      });

      Alert.alert('Success', response.data.message || 'Password updated');
      navigation.navigate('Login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed';
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
          <Text style={styles.title}>Reset Password</Text>

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
            placeholder="Old Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            onChangeText={setOldPassword}
            value={oldPassword}
          />

          <TextInput
            placeholder="New Password"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            onChangeText={setNewPassword}
            value={newPassword}
          />

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Update Password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#004B8D',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resetButton: {
    backgroundColor: '#004B8D',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  resetText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  backText: {
    marginTop: 20,
    color: '#00AEEF',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
