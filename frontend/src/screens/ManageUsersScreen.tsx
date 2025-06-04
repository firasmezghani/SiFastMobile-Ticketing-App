import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'EditUser'>;

const ManageUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavProp>();

  useEffect(() => {
    console.log("🚀 ManageUsersScreen mounted");
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("🟨 Token:", token);
  
      if (!token) {
        Alert.alert("Missing Token", "Token not found in storage");
        setLoading(false);
        return;
      }
  
      const res = await axios.get('http://10.0.2.2:5005/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Response from /api/users:", res.data);
  
      if (!Array.isArray(res.data)) {
        console.log("❌ Unexpected data format:", res.data);
        Alert.alert("Error", "Unexpected data format from backend");
      }
  
      setUsers(res.data);
    } catch (error: any) {
      console.log("❌ Error fetching users:", error?.response?.data || error.message);
      Alert.alert("API Error", error?.response?.data?.message || error.message);
    } finally {
      console.log("🟢 Finished loading");
      setLoading(false);
    }
  };
  
  

  const promoteUser = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://10.0.2.2:5005/api/users/promote/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'User promoted to admin');
      fetchUsers(); // Refresh
    } catch (error: any) {
      console.error("❌ Promote failed:", error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to promote user');
    }
  };
  

  const deleteUser = async (userId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`http://10.0.2.2:5005/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Deleted', 'User has been removed');
              fetchUsers();
            } catch (error: any) {
              console.error("❌ Delete failed:", error?.response?.data || error.message);
              Alert.alert('Error', error?.response?.data?.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };
  

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <Text style={styles.name}>{item.name || 'No name'}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Role: {item.role}</Text>

      <View style={styles.actions}>
        {item.role !== 'admin' && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => promoteUser(item._id)}
          >
            <Text style={styles.buttonText}>Promote to Admin</Text>
          </TouchableOpacity>
        )}
<TouchableOpacity
  style={styles.updateButton}
  onPress={() =>
    navigation.navigate('EditUser', {
      userId: item._id,
      existingName: item.name,
      existingEmail: item.email,
    })
  }
>
  <Text style={styles.buttonText}>Edit</Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteUser(item._id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Users</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  userCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: '#ffc107', // yellow-orange
    padding: 6,
    borderRadius: 6,
  },  
  name: { fontWeight: 'bold', fontSize: 16 },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 6,
  },
  buttonText: { color: 'white' },
});

export default ManageUsersScreen;