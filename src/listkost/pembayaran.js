import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PembayaranScreen = () => {
  const navigation = useNavigation();
  const bankAccount = '0696-0103-2244-502 (BANK BRI)';  
  const ownerName = 'Mommykost Ekonomi';
  const adminNote = 'Harap melakukan pembayaran sebelum tanggal 10 setiap bulannya untuk mengamankan kamar.dan ss bukti pembayaran';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pembayaran</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.infoSection}>
            <Image
              source={require('../../assets/12.jpg')}
              style={styles.logoImage}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.kostName}>{ownerName}</Text>
              <Text style={styles.kostDescription}>
                Pembayaran kost kategori ekonomi
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Aktif</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bankSection}>
            <Text style={styles.sectionTitle}>Informasi Rekening</Text>
            <View style={styles.bankInfoContainer}>
              <View style={styles.bankIconContainer}>
                <Ionicons name="card" size={24} color="#1E3D59" />
              </View>
              <View>
                <Text style={styles.bankLabel}>Nomor Rekening</Text>
                <Text style={styles.bankAccountText}>{bankAccount}</Text>
              </View>
            </View>
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.sectionTitle}>Pesan dari Admin</Text>
            <View style={styles.noteContainer}>
              <Ionicons name="information-circle" size={24} color="#FF6B6B" style={styles.noteIcon} />
              <Text style={styles.noteText}>{adminNote}</Text>
            </View>
          </View>
        </View>


        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Konfirmasi Pembayaran</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#1E3D59',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  kostName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3D59',
    marginBottom: 4,
  },
  kostDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  bankSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3D59',
    marginBottom: 12,
  },
  bankInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#E8EAF6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  bankAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3D59',
  },
  noteSection: {
    marginBottom: 20,
  },
  noteContainer: {
    backgroundColor: '#FFF3F3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  paymentOptionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  paymentOptionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E3D59',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PembayaranScreen;