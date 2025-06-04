import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CreateEventScreen = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [maxTickets, setMaxTickets] = useState('');

  const createEvent = async () => {
    if (!title || !location || !description || !date || !maxTickets) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const payload = {
        title: title,
        location,
        description,
        date,
        maxTickets: Number(maxTickets),
      };
      

      console.log('🟨 Event data being sent:', payload);

      await axios.post('http://10.0.2.2:5005/api/tickets/events', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Event created successfully');

      // Clear form
      setTitle('');
      setLocation('');
      setDescription('');
      setDate('');
      setMaxTickets('');
    } catch (error: any) {
      console.error('❌ Event creation error:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create event.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (e.g. 2025-06-01)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Max Tickets"
        value={maxTickets}
        onChangeText={setMaxTickets}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={createEvent}>
        <Text style={styles.buttonText}>CREATE EVENT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;