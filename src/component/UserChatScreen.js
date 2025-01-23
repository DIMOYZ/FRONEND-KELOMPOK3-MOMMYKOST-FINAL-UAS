// src/component/UserChatScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { ref, onValue, push } from 'firebase/database';
import { auth, db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';

const UserChatScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('User'); // Default username

  // Cek user login + ambil data user (username)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}/username`);
        const unsubscribeUser = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUsername(snapshot.val());
            console.log(`User data:`, snapshot.val()); // Debug
          } else {
            console.log(`No username for ${currentUser.uid}`); // Debug
          }
        });
        return () => {
          if (unsubscribeUser) unsubscribeUser();
        };
      }
    });
    return () => unsubscribe();
  }, []);

  // Ambil pesan di `chats/{uid}/messages`
  useEffect(() => {
    if (user) {
      const messagesRef = ref(db, `chats/${user.uid}/messages`);
      const unsubMsg = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const loaded = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          // Urutkan berdasarkan timestamp
          loaded.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(loaded);
          console.log(`User messages:`, loaded); // Debug
        } else {
          setMessages([]);
          console.log(`No messages for user.`); // Debug
        }
      });
      return () => {
        if (unsubMsg) unsubMsg();
      };
    }
  }, [user]);

  // Mengirim pesan
  const handleSend = async () => {
    if (!inputText.trim() || !user) return;
    try {
      const msg = {
        text: inputText,
        timestamp: Date.now(),
        sender: 'user',
        username: username || 'User',
      };
      const messagesRef = ref(db, `chats/${user.uid}/messages`);
      await push(messagesRef, msg);
      setInputText('');
      console.log('Message sent:', msg); // Debug
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Render tiap item
  const renderItem = ({ item }) => {
    const isMyMsg = (item.sender === 'user');
    return (
      <View style={[
        styles.messageContainer,
        isMyMsg ? styles.myMessage : styles.otherMessage
      ]}>
        {/* Info username */}
        <Text style={styles.senderInfo}>
          {item.username}
        </Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header + tombol back */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"\u25C0"} Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Admin</Text>
      </View>

      {/* Daftar Pesan */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.messagesList}
      />

      {/* Input Chat */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
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

export default UserChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E6C4' },
  header: {
    flexDirection: 'row', backgroundColor: '#C9A574',
    padding: 15, marginTop: 30, borderRadius: 8,
    marginHorizontal: 10, alignItems: 'center', marginBottom: 5
  },
  backButton: {
    marginRight: 10, backgroundColor: '#8B6C42',
    borderRadius: 5, paddingHorizontal: 8, paddingVertical: 5
  },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  messagesList: { flex: 1, paddingHorizontal: 10 },
  messageContainer: {
    maxWidth: '70%', marginVertical: 5, padding: 8, borderRadius: 6
  },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#49A078' },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#eee' },
  senderInfo: {
    fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 3
  },
  messageText: { color: '#000' },
  inputContainer: {
    flexDirection: 'row', margin: 10,
    backgroundColor: '#fff', borderRadius: 8,
    overflow: 'hidden', alignItems: 'center'
  },
  input: { flex: 1, paddingHorizontal: 10, color: '#000' },
  sendButton: {
    backgroundColor: '#C9A574', paddingHorizontal: 15, paddingVertical: 10
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
});
