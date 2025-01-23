// src/listkost/detailkostvvip.js
import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const VVIPDetail = ({ route }) => {
  const { kost } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/1.jpg')} 
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>Mommykost VVIP</Text>
          </View>
        </View>

        {/* Main Image */}
        <Image
          source={
            kost.image
              ? { uri: kost.image }
              : require('../../assets/1.jpg')
          }
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{kost.name}</Text>
          <Text style={styles.subtitle}>{kost.category}</Text>

          <View style={styles.specificationContainer}>
            <Text style={styles.specTitle}>Spesifikasi kamar</Text>
            <View style={styles.specList}>
              {[
                'Kasur King Size',
                'Lemari Besar',
                'Kamar Mandi Dalam dengan Bathtub',
                'AC',
                'TV LED 50"',
                'Mini Kitchen',
                'Free Wifi'
              ].map((item, index) => (
                <View key={index} style={styles.specItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.specText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Harga Sewa</Text>
          <Text style={styles.price}>{kost.price}</Text>
        </View>
        <TouchableOpacity
  style={styles.confirmButton}
  onPress={() => navigation.navigate('PembayaranScreen')} // Pastikan rutenya sesuai
>
  <Text style={styles.confirmText}>Confirm</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VVIPDetail;

const styles = StyleSheet.create({
  // silakan samakan style dengan file lain agar seragam
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#D4AF37',
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  logoImage: {
    width: 24,
    height: 24,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  specificationContainer: {
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  specTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  specList: {
    gap: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specText: {
    fontSize: 16,
    color: '#333',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
