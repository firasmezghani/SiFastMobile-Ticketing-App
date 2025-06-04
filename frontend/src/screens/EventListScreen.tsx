import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
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
  shadow: 'rgba(24,112,183,0.08)',
};

type EventType = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxTickets?: number;
};

const EventListScreen = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const profileRes = await axios.get('http://10.0.2.2:5005/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.data && profileRes.data.role) setUserRole(profileRes.data.role);

        const response = await axios.get('http://10.0.2.2:5005/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data || []);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch events.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleBuyTicket = async (eventId: string, eventName: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'http://10.0.2.2:5005/api/tickets',
        {
          event: eventId,
          purchaserName: 'You', // Replace with actual user name if desired
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert('Success', `Ticket for "${eventName}" created!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create ticket.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`http://10.0.2.2:5005/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setEvents(events.filter(e => e._id !== eventId));
              Alert.alert('Deleted', 'Event successfully removed');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const renderEvent = ({ item }: { item: EventType }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardInfo}>📍 {item.location}</Text>
      <Text style={styles.cardInfo}>📅 {new Date(item.date).toLocaleDateString()}</Text>
      {item.description ? (
        <Text style={styles.cardDesc}>{item.description}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => handleBuyTicket(item._id, item.title)}
      >
        <Text style={styles.buyButtonText}>Reserve Ticket</Text>
      </TouchableOpacity>
      {userRole === 'admin' && (
        <TouchableOpacity onPress={() => handleDeleteEvent(item._id)}>
          <Text style={styles.deleteText}>🗑 Delete Event</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading)
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Events</Text>
      {userRole === 'admin' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateEvent' as never)}
        >
          <Text style={styles.addButtonText}>➕ Add Event</Text>
        </TouchableOpacity>
      )}
      {events.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No events available yet.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingTop: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 22,
    borderRadius: 16,
    marginBottom: 18,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 3,
  },
  cardInfo: {
    fontSize: 14,
    color: COLORS.subtitle,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 22,
    alignItems: 'center',
    alignSelf: 'flex-end',
    elevation: 2,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 9,
    marginBottom: 18,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  loaderBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: COLORS.subtitle,
    fontSize: 18,
    fontWeight: '500',
  },
});

export default EventListScreen;
