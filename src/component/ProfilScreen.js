// src/component/ProfilScreen.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../firebaseConfig';

const ProfileScreen = ({ navigation }) => {
  const auth = getAuth(app);
  const database = getDatabase(app);
  const user = auth.currentUser;

  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfileData(data);
        }
      });
    } else {
      Alert.alert('Error', 'User not logged in');
    }
  }, [user, database]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'\u25C0'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mommykost</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profileData.photoURL || 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Ubah Foto</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Keamanan Akun</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Email yang Dituatkan</Text>
          <Text style={styles.value}>{user?.email || '-'}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>No Telepon yang Dituatkan</Text>
          <Text style={styles.value}>{profileData.nohp || '-'}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Info Pribadi</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Nama Tampilan</Text>
          <Text style={styles.value}>{profileData.username || '-'}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <Text style={styles.value}>{profileData.gender || '-'}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>profesi</Text>
          <Text style={styles.value}>{profileData.profesi || '-'}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Tempat Tinggal</Text>
          <Text style={styles.value}>{profileData.location || '-'}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('Edit Info')}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E6C4',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#C9A574',
  },
  backButton: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  changePhotoText: {
    marginTop: 10,
    color: '#C9A574',
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    backgroundColor: '#C9A574',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
