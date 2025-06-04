import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoadingScreen = ({ navigation }: any) => {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    };
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#004B8D" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoadingScreen;
