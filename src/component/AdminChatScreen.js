// src/component/AdminChatScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { ref, onValue, push, off } from 'firebase/database';
import { auth, db } from '../../firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';

const AdminChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, username: chatUsername } = route.params; // user ID dan username yang dipilih admin

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('Admin'); // Username admin
  const [loading, setLoading] = useState(true);
  const [adminUserId, setAdminUserId] = useState(null);

  useEffect(() => {
    // Mendapatkan admin user ID
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setAdminUserId(currentUser.uid);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Mengambil pesan dari node "chats/messages" yang berkaitan dengan userId
  useEffect(() => {
    const messagesRef = ref(db, 'chats/messages');
    const handleMessages = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Filter pesan yang dikirim oleh admin atau pengguna tertentu
        const relevantMessages = Object.keys(data).filter(key => {
          const msg = data[key];
          return msg.userId === userId || msg.sender === 'admin';
        });
        const loaded = relevantMessages.map(key => ({
          id: key,
          ...data[key],
        }));
        loaded.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(loaded);
      } else {
        setMessages([]);
      }
      setLoading(false);
    };

    onValue(messagesRef, handleMessages);

    // Cleanup listeners
    return () => {
      off(messagesRef, 'value', handleMessages);
    };
  }, [userId]);

  const handleSend = async () => {
    if (!inputText.trim()) return; // Jangan kirim jika input kosong

    if (!adminUserId) {
      console.error('Admin user ID not found');
      return;
    }

    try {
      const messagesRef = ref(db, 'chats/messages');
      await push(messagesRef, {
        text: inputText,
        timestamp: Date.now(),
        sender: 'admin',
        username: 'Admin',
        userId: adminUserId
      });
      setInputText('');
    } catch (error) {
      console.error('Error sending admin message:', error);
    }
  };

  // Render tiap pesan
  const renderItem = ({ item }) => {
    const isAdminMsg = item.sender === 'admin';
    return (
      <View
        style={[
          styles.messageContainer,
          isAdminMsg ? styles.adminMessage : styles.userMessage
        ]}
      >
        <Text style={styles.senderInfo}>{item.username}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header dengan tombol Back */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"\u25C0"} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {`Chat with ${chatUsername}`}
        </Text>
      </View>

      {/* Daftar Pesan */}
      {loading ? (
        <ActivityIndicator size="large" color="#C9A574" style={styles.loader} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          style={styles.messagesList}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Input Admin */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ketik balasan..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AdminChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E6C4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9A574',
    padding: 15,
    marginTop: 30,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 5,
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
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  listContent: {
    paddingVertical: 10,
  },
  loader: {
    marginTop: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
  },
  adminMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#49A078',
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  senderInfo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#C9A574',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
