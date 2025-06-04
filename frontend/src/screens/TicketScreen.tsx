import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
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
  shadow: 'rgba(24,112,183,0.06)',
};

type TicketType = {
  _id: string;
  event: {
    title: string;
    date: string;
    location: string;
  };
  purchaserName: string;
  qrCode: string;
  isValidated: boolean;
  createdAt: string;
};

export default function TicketScreen() {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token');
        const profileRes = await axios.get('http://10.0.2.2:5005/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const role = profileRes.data.role;

        const endpoint =
          role === 'admin'
            ? 'http://10.0.2.2:5005/api/tickets'
            : 'http://10.0.2.2:5005/api/tickets/user';

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data.tickets || []);
      } catch (err) {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const renderTicket = ({ item }: { item: TicketType }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('TicketDetail' as never, { ticket: item } as never)
      }
    >
      <Text style={styles.cardTitle}>
        {item.event?.title && item.event.title.trim() !== ''
          ? item.event.title
          : '🎤 Untitled Event'}
      </Text>
      <Text style={styles.cardSubtitle}>
        {item.event?.date
          ? new Date(item.event.date).toLocaleString()
          : 'No date'}
      </Text>
      <Text style={styles.cardDesc}>
        Location: {item.event?.location || 'N/A'}
      </Text>
      <Text style={[styles.cardStatus, { color: item.isValidated ? COLORS.accent : COLORS.primary }]}>
        {item.isValidated ? '✅ Validated' : '⏳ Not validated'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎟️ My Tickets</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 48 }} />
      ) : tickets.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>You have no tickets yet.</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 32,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 18,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 22,
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.subtitle,
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },
  cardStatus: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
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
