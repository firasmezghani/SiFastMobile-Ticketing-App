import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type EditUserRouteProp = RouteProp<RootStackParamList, 'EditUser'>;

const EditUserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EditUserRouteProp>();
  const { userId, existingName, existingEmail } = route.params;

  const [name, setName] = useState(existingName);
  const [email, setEmail] = useState(existingEmail);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://10.0.2.2:5005/api/users/${userId}`, { name, email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Success", "User updated");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", "Failed to update user");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} />

      <Button title="Update User" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 6,
  },
});

export default EditUserScreen;
