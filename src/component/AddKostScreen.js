// src/component/AddKostScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { ref, push } from 'firebase/database';
import { db } from '../../firebaseConfig'; // Sesuaikan path

const AddKostScreen = ({ navigation }) => {
  // State untuk menampung input dari user
  const [kostName, setKostName] = useState('');
  const [kostCategory, setKostCategory] = useState('');
  const [kostPrice, setKostPrice] = useState('');

  // Fungsi menambah data kost ke Realtime Database
  const handleAddKost = async () => {
    if (!kostName || !kostCategory || !kostPrice) {
      Alert.alert('Error', 'Mohon isi semua field!');
      return;
    }

    try {
      // Arahkan ke node 'kosts'
      const kostsRef = ref(db, 'kosts');
      // push data baru
      await push(kostsRef, {
        name: kostName,
        category: kostCategory,
        price: kostPrice,
      });

      Alert.alert('Success', 'Kost berhasil ditambahkan!');

      // Reset form
      setKostName('');
      setKostCategory('');
      setKostPrice('');

      // Kembali ke screen sebelumnya (ManageKostsScreen)
      navigation.goBack();
    } catch (error) {
      console.error('Error adding kost:', error);
      Alert.alert('Error', 'Gagal menambahkan kost.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header sederhana dengan tombol Back */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'\u25C0'} Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Kost</Text>
      </View>

      {/* Form Input */}
      <TextInput
        style={styles.input}
        placeholder="Nama Kost"
        value={kostName}
        onChangeText={setKostName}
      />
      <TextInput
        style={styles.input}
        placeholder="Kategori (Ekonomi, VIP, VVIP)"
        value={kostCategory}
        onChangeText={setKostCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Harga (contoh: Rp.500.000)"
        value={kostPrice}
        onChangeText={setKostPrice}
      />

      <Button title="Tambah Kost" onPress={handleAddKost} />
    </View>
  );
};

export default AddKostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E6C4',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9A574',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  backButton: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#8B6C42',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#000',
  },
});
