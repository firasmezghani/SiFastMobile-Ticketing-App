import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const navigation = useNavigation();

  const handleConfirm = () => {
    navigation.goBack(); // or navigation.navigate('Ticket') to go to ticket list
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/credit_card.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Confirm Your Payment</Text>
      <Text style={styles.description}>
        Your ticket is almost yours! Click below to finalize.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>✅ Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004B8D',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#00B894',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default PaymentScreen;
