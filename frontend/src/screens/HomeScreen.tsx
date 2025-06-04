import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgUri } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const COLORS = {
  primary: '#1870B7',
  accent: '#F26322',
  background: '#F7F9FB',
  card: '#FFF',
  text: '#1A1A1A',
  subtitle: '#4A4A4A',
  shadow: 'rgba(24,112,183,0.06)',
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return setRole(null);
        const profileRes = await axios.get('http://10.0.2.2:5005/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(profileRes.data.role || null);
        setUsername(profileRes.data.name || '');
      } catch (err) {
        setRole(null);
        setUsername('');
        Alert.alert('Session Error', 'Please log in again.');
        navigation.navigate('Login' as never);
      }
    };
    fetchRole();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <SvgUri
          width="44"
          height="44"
          source={require('../../assets/sifast-logo.svg')}
        />
        <Text style={styles.headerText}>SiFAST Ticketing</Text>
      </View>
      {/* Greeting */}
      {username ? (
        <Text style={styles.greeting}>Greetings {username}!</Text>
      ) : null}
      {/* Main */}
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Easily manage your events & tickets with SiFAST’s platform.
        </Text>
        {/* Card Links */}
<View style={styles.cardGrid}>
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('Ticket' as never)}
  >
    <Text style={styles.cardTitle}>🎟️ My Tickets</Text>
    <Text style={styles.cardDesc}>View & scan your event tickets</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('EventList' as never)}
  >
    <Text style={styles.cardTitle}>📅 Events</Text>
    <Text style={styles.cardDesc}>Browse available events</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('Profile' as never)}
  >
    <Text style={styles.cardTitle}>👤 Profile</Text>
    <Text style={styles.cardDesc}>Account settings & logout</Text>
  </TouchableOpacity>
</View>

{/* Admin-Only Action Buttons */}
{role === 'admin' && (
  <>
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => navigation.navigate('CreateEvent' as never)}
    >
      <Text style={styles.actionButtonText}>+ Create Event</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => navigation.navigate('ScanTicket' as never)}
    >
      <Text style={styles.actionButtonText}>🔍 Scan Ticket</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => navigation.navigate('ManageUsers' as never)}
    >
      <Text style={styles.actionButtonText}>👥 Manage Users</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => navigation.navigate('AllTickets' as never)}
    >
      <Text style={styles.actionButtonText}>🎫 All Tickets</Text>
    </TouchableOpacity>
  </>
)}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: 44,
    paddingHorizontal: 20,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 25,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 0,
    alignSelf: 'center',
  },
  body: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.subtitle,
    textAlign: 'center',
    marginBottom: 28,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 22,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 22,
    borderRadius: 16,
    width: 154,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    marginBottom: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.subtitle,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 16,
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    paddingHorizontal: 34,
    borderRadius: 30,
    elevation: 3,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
