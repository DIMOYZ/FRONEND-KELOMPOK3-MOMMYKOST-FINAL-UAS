// src/component/ManageKostsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { ref, onValue, update, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

import { db } from '../../firebaseConfig';

const ManageKostsScreen = () => {
  const navigation = useNavigation();

  // State list kost
  const [kostList, setKostList] = useState([]);

  // State edit mode
  const [editKostId, setEditKostId] = useState(null);
  const [kostName, setKostName] = useState('');
  const [kostCategory, setKostCategory] = useState('');
  const [kostPrice, setKostPrice] = useState('');

  // READ data kost
  useEffect(() => {
    const kostsRef = ref(db, 'kosts');
    const unsubscribe = onValue(kostsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedKosts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setKostList(loadedKosts);
      } else {
        setKostList([]);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Saat tombol "Edit" ditekan
  const handleEditKost = (kost) => {
    setEditKostId(kost.id);
    setKostName(kost.name);
    setKostCategory(kost.category);
    setKostPrice(kost.price);
  };

  // UPDATE
  const handleUpdateKost = async () => {
    if (!editKostId) return;
    if (!kostName || !kostCategory || !kostPrice) {
      Alert.alert('Error', 'Mohon isi semua field!');
      return;
    }

    try {
      const kostRef = ref(db, `kosts/${editKostId}`);
      await update(kostRef, {
        name: kostName,
        category: kostCategory,
        price: kostPrice,
      });
      Alert.alert('Success', 'Kost berhasil diperbarui!');
      setEditKostId(null);
      setKostName('');
      setKostCategory('');
      setKostPrice('');
    } catch (error) {
      console.error('Error updating kost:', error);
      Alert.alert('Error', 'Gagal memperbarui kost.');
    }
  };

  // DELETE
  const handleDeleteKost = async (kostId) => {
    try {
      const kostRef = ref(db, `kosts/${kostId}`);
      await remove(kostRef);
      Alert.alert('Success', 'Kost berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting kost:', error);
      Alert.alert('Error', 'Gagal menghapus kost.');
    }
  };

  // Render item
  const renderKostItem = ({ item }) => (
    <View style={styles.kostItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.kostName}>{item.name}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Price: {item.price}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEditKost(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteKost(item.id)}
        >
          <Text style={styles.buttonText}>Del</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER dengan tombol Back */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'\u25C0'} Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Kosts (Admin)</Text>
      </View>

      {/* Tombol ke AddKostScreen */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddKostScreen')}
      >
        <Text style={styles.addButtonText}>+ Tambah Kost Baru</Text>
      </TouchableOpacity>

      {/* Form Edit (opsional) */}
      {editKostId && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Edit Kost</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Kost"
            value={kostName}
            onChangeText={setKostName}
          />
          <TextInput
            style={styles.input}
            placeholder="Kategori"
            value={kostCategory}
            onChangeText={setKostCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Harga"
            value={kostPrice}
            onChangeText={setKostPrice}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateKost}>
            <Text style={styles.saveButtonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#999', marginTop: 5 }]}
            onPress={() => {
              setEditKostId(null);
              setKostName('');
              setKostCategory('');
              setKostPrice('');
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List Kost */}
      <FlatList
        data={kostList}
        keyExtractor={(item) => item.id}
        renderItem={renderKostItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default ManageKostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E6C4',
    padding: 20,
    // paddingTop: 50, // Boleh dihilangkan jika sudah ada header custom
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9A574',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
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
  addButton: {
    backgroundColor: '#2E86C1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  kostItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    padding: 10,
    alignItems: 'center',
  },
  kostName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#49A078',
  },
  deleteButton: {
    backgroundColor: '#D9534F',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#C9A574',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
