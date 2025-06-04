import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#1870B7',
  accent: '#F26322',
  background: '#F7F9FB',
  card: '#FFF',
  text: '#1A1A1A',
  subtitle: '#4A4A4A',
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);

  // Profile update modal
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<'username' | 'email' | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Password change modal
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const res = await axios.get('http://10.0.2.2:5005/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ username: res.data.name, email: res.data.email });
      } catch (e) {
        Alert.alert('Session expired', 'Please sign in again.');
        navigation.navigate('LoginScreen' as never);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle edit for username/email
  const handleEdit = (field: 'username' | 'email') => {
    setFieldToEdit(field);
    setInputValue('');
    setModalVisible(true);
  };

  // Save username/email
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      // You need the user ID (fetch from /profile or keep in state if available)
      const profileRes = await axios.get('http://10.0.2.2:5005/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = profileRes.data.id || profileRes.data._id;

      const payload = { [fieldToEdit as string]: inputValue };
      await axios.put(
        `http://10.0.2.2:5005/api/users/${userId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => ({
        ...prev,
        [fieldToEdit as string]: inputValue,
      }));
      Alert.alert('Success', `${fieldToEdit} updated!`);
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Update failed.');
    }
  };

  // Password Modal handlers
  const handleEditPassword = () => {
    setOldPassword('');
    setNewPassword('');
    setPasswordModalVisible(true);
  };

  const handleChangePassword = async () => {
    try {
      setChangingPassword(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await axios.post(
        'http://10.0.2.2:5005/api/auth/forgot-password',
        {
          email: user.email,
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Success', res.data.message || 'Password changed!');
      setPasswordModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Password update failed.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
  };

  if (loading)
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{user.username}</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEdit('username')}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEdit('email')}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Password</Text>
        <TouchableOpacity
          style={[styles.editBtn, { marginBottom: 12 }]}
          onPress={handleEditPassword}
        >
          <Text style={styles.editText}>Change Password</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Modal for editing username/email */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Edit {fieldToEdit?.charAt(0).toUpperCase() + fieldToEdit?.slice(1)}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter new ${fieldToEdit}`}
              autoCapitalize={fieldToEdit === 'username' ? 'none' : 'none'}
              onChangeText={setInputValue}
              value={inputValue}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for changing password */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleChangePassword}
                disabled={changingPassword}
              >
                <Text style={styles.saveText}>
                  {changingPassword ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingTop: 46,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 18,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 26,
    borderRadius: 18,
    width: '88%',
    elevation: 3,
    marginBottom: 28,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 3,
    fontWeight: '400',
  },
  editBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 22,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,50,80,0.13)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 28,
    width: '85%',
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#EEF3F6',
    borderRadius: 10,
    padding: 11,
    width: '100%',
    fontSize: 15,
    marginBottom: 22,
    marginTop: 14,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 14,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 13,
    marginRight: 7,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 13,
  },
  cancelText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 15,
  },
});

