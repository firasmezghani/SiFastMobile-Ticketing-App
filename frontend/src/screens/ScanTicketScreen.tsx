import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

export default function ScanTicketScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  useEffect(() => {
    if (barcodes.length > 0) {
      const value = barcodes[0].displayValue || barcodes[0].rawValue;
      if (value) {
        Alert.alert('QR Code Detected', value, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    }
  }, [barcodes]);

  if (device == null) return <View style={styles.center}><Text>Loading camera...</Text></View>;
  if (!hasPermission) return <View style={styles.center}><Text>No camera permission</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Scan a QR Code</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  closeBtn: {
    marginTop: 14,
    backgroundColor: '#1870B7',
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
});
