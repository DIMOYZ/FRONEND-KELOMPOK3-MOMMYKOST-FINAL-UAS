// src/component/AdminChatListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { db, auth } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';

const AdminChatListScreen = () => {
  const navigation = useNavigation();
  const [uniqueUsers, setUniqueUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verifikasi apakah pengguna adalah admin
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const roleRef = ref(db, `users/${currentUser.uid}/role`);
        onValue(roleRef, (snapshot) => {
          if (snapshot.exists()) {
            const role = snapshot.val();
            if (role === 'admin') {
              setIsAdmin(true);
              fetchMessages();
            } else {
              console.error('Access denied: User is not an admin.');
              setLoading(false);
            }
          } else {
            setIsAdmin(false);
            setLoading(false);
          }
        });
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const fetchMessages = () => {
    const messagesRef = ref(db, 'chats/messages');
    const handleMessages = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userMap = {};

        Object.keys(data).forEach((messageId) => {
          const message = data[messageId];
          if (message.sender === 'user' && message.userId) {
            // Kumpulkan userId dan username unik
            if (!userMap[message.userId]) {
              userMap[message.userId] = message.username;
            }
          }
        });

        setUniqueUsers(userMap);
      } else {
        setUniqueUsers({});
      }
      setLoading(false);
    };

    onValue(messagesRef, handleMessages);

    // Cleanup listeners
    return () => {
      off(messagesRef, 'value', handleMessages);
    };
  };

  const handleOpenChat = (userId, username) => {
    navigation.navigate('AdminChatScreen', { userId, username });
  };

  const renderItem = ({ item }) => {
    const [userId, username] = item;
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleOpenChat(userId, username)}
      >
        <Text style={styles.userItemText}>
          {`Chat with ${username}`}
        </Text>
      </TouchableOpacity>
    );
  };

  const userList = Object.entries(uniqueUsers);

  return (
    <View style={styles.container}>
      {/* Header dengan Tombol Kembali */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"\u25C0"} Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List of Users Who Have Chatted</Text>
      </View>

      {/* Daftar Pengguna yang Telah Mengirim Pesan */}
      {loading ? (
        <ActivityIndicator size="large" color="#C9A574" style={styles.loader} />
      ) : userList.length === 0 ? (
        <Text style={styles.noText}>No chats yet.</Text>
      ) : (
        <FlatList
          data={userList}
          keyExtractor={(item) => item[0]}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default AdminChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E6C4',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9A574',
    padding: 15,
    marginTop: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
    backgroundColor: '#8B6C42',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  noText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  userItem: {
    backgroundColor: '#C9A574',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  userItemText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
