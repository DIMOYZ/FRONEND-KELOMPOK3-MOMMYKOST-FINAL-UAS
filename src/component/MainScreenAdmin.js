import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConfig';

const MainScreenAdmin = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Sign out error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E3D59" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerOverlay} />
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonShadow]}
            onPress={() => navigation.navigate('ManageKostsScreen')}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Manage Kosts</Text>
              <Text style={styles.buttonSubtext}>Add, edit, or remove listings</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonShadow]}
            onPress={() => navigation.navigate('AdminChatListScreen')}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Chat with Users</Text>
              <Text style={styles.buttonSubtext}>Respond to inquiries</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonShadow]}
            onPress={() => navigation.navigate('ChatScreen')}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Group Chat</Text>
              <Text style={styles.buttonSubtext}>Manage community discussions</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.signOutButton, styles.buttonShadow]} 
          onPress={handleSignOut}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainScreenAdmin;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#1E3D59',
    padding: 25,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B6B',
    opacity: 0.1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  buttonShadow: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonContent: {
    flexDirection: 'column',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3D59',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#666666',
  },
  footer: {
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    padding: 18,
    borderRadius: 12,
    width: '100%',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});