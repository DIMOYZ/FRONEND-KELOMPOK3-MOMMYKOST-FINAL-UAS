// src/component/MainScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

import { auth, db } from '../../firebaseConfig';

const MainScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [kosts, setKosts] = useState([]);

  // Ambil data kost dari Realtime Database
  useEffect(() => {
    const kostsRef = ref(db, 'kosts');
    const unsubscribe = onValue(kostsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedKosts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key], // { name, category, price, ... }
        }));
        setKosts(loadedKosts);
      } else {
        setKosts([]);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Sign out error:', error.message);
    }
  };

  // Filter kost
  const filteredKosts =
    selectedCategory === 'Semua'
      ? kosts
      : kosts.filter(kost => kost.category === selectedCategory);

  // Fungsi untuk render card kost
  const renderKostCard = (kost) => {
    // Pilih gambar berdasarkan kategori
    let imageSource;
    if (kost.category === 'Ekonomi') {
      imageSource = require('../../assets/eko.jpg');
    } else if (kost.category === 'VIP') {
      imageSource = require('../../assets/vip.jpg');
    } else if (kost.category === 'VVIP') {
      imageSource = require('../../assets/vvip.jpg');
    } else {
      // Jika kategori diluar itu, gunakan gambar default
      imageSource = require('../../assets/1.jpg');
    }

    return (
      <TouchableOpacity
        style={styles.card}
        key={kost.id}
        // Contoh navigasi: akan ke "<Kategori>Detail" screen, sesuaikan dengan navigasi Anda
        onPress={() => navigation.navigate(`${kost.category}Detail`, { kost })}
      >
        <Image
          source={imageSource}
          style={styles.cardImage}
        />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{kost.name}</Text>
          <Text style={styles.cardSubtitle}>{kost.category}</Text>
          <Text style={styles.cardPrice}>{kost.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require('../../assets/12.jpg')}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Mommykost (User)</Text>
        </View>
      </View>

      {/* Kategori Buttons */}
      <View style={styles.categoryContainer}>
        {['Semua', 'Ekonomi', 'VIP', 'VVIP'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Banner (contoh) */}
      <View style={styles.bannerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerContainer}
        >
          {[1, 2, 3].map((index) => (
            <Image
              key={index}
              source={require('../../assets/1.jpg')}
              style={styles.bannerImage}
            />
          ))}
        </ScrollView>
      </View>

      {/* List Kost */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          {filteredKosts.map(renderKostCard)}
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('UserChatScreen')}
        >
          <Text style={styles.navIcon}>📩</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('ChatScreen')}
        >
          <Text style={styles.navIcon}>📩 grup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleSignOut}>
          <Text style={styles.navIcon}>🔑</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E6C4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#C9A574',
    marginTop: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#C9A574',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: '#8B6C42',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  bannerWrapper: {
    marginVertical: 10,
  },
  bannerContainer: {
    paddingHorizontal: 5,
  },
  bannerImage: {
    width: 380,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flex: 1,
  },
  cardContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 70,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  cardText: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'gray',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C9A574',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#C9A574',
    paddingVertical: 20,
  },
  navIcon: {
    fontSize: 30,
  },
  navItem: {
    alignItems: 'center',
  },
});
