import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TicketDetailRouteProp = RouteProp<RootStackParamList, 'TicketDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TicketDetail'>;

const TicketDetailScreen = () => {
  const route = useRoute<TicketDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { ticket } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎟️ Ticket Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Event:</Text>
        <Text style={styles.value}>{ticket.event.title}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {new Date(ticket.event.date).toLocaleDateString()}
        </Text>

        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{ticket.event.location}</Text>

        <Text style={styles.label}>Purchaser:</Text>
        <Text style={styles.value}>{ticket.purchaserName}</Text>

        <Text style={styles.label}>Validation Status:</Text>
        <Text
  style={[
    styles.status,
    { color: ticket.isValidated ? 'green' : 'red' },
  ]}
>
  {ticket.isValidated ? '✅ Valid' : '❌ Not Used'}
</Text>

        <Text style={styles.label}>QR Code:</Text>
        <Image
          source={{ uri: ticket.qrCode }}
          style={styles.qr}
          resizeMode="contain"
        />
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.label}>Ready to secure your spot?</Text>
        <View style={{ marginTop: 10 }}>
          <Text
            style={styles.buyButton}
            onPress={() => navigation.navigate({ name: 'Payment' })}
          >
            💳 Buy Ticket
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f4f4f4',
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#444',
  },
  value: {
    fontSize: 16,
    color: '#222',
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  qr: {
    marginTop: 10,
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
  },
  buyButton: {
    backgroundColor: '#145A5B',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TicketDetailScreen;
