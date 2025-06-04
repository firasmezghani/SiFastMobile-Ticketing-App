import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AllTicketsScreen() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get('http://10.0.2.2:5005/api/tickets/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data.tickets || []);
      } catch (e) {
        Alert.alert('Error', 'Failed to fetch tickets.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>🎫 Ticket ID: <Text style={styles.value}>{item._id}</Text></Text>
      <Text style={styles.label}>👤 User: <Text style={styles.value}>{item.userId?.name || item.userId?.email || 'N/A'}</Text></Text>
      <Text style={styles.label}>📧 Email: <Text style={styles.value}>{item.userId?.email || 'N/A'}</Text></Text>
      <Text style={styles.label}>🎟️ Event: <Text style={styles.value}>{item.event?.title || 'N/A'}</Text></Text>
      <Text style={styles.label}>📍 Location: <Text style={styles.value}>{item.event?.location || 'N/A'}</Text></Text>
      <Text style={styles.label}>🕓 Date: <Text style={styles.value}>{item.event?.date ? new Date(item.event.date).toLocaleString() : 'N/A'}</Text></Text>
  
      {/* Status badge */}
      <Text style={styles.label}>
  Status:
  <Text style={{
    fontWeight: '700',
    color: item.isValidated ? '#28a745' : '#F26322',
    marginLeft: 8,
  }}>
    {item.isValidated ? '✅ Valid' : '❌ Not Used'}
  </Text>
</Text>

    </View>
  );
  

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Tickets</Text>
      <FlatList
        data={tickets}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#f8f8f8' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 18, color: '#1870B7' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 14, elevation: 2 },
  label: { fontWeight: '700', color: '#333' },
  value: { fontWeight: '400', color: '#1870B7' },
});
