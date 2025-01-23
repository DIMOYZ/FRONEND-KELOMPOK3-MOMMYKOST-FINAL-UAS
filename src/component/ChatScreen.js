// src/component/ChatScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, push } from 'firebase/database';
import { auth, db } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null); // User yang sedang login
  const [username, setUsername] = useState(''); // Username pengguna
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // Memantau status autentikasi dan mengambil username
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(db, `users/${currentUser.uid}/username`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUsername(snapshot.val());
          } else {
            setUsername('Anonymous');
          }
        });
      } else {
        setUser(null);
        setUsername('');
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Mengambil pesan dari node "chats/messages"
  useEffect(() => {
    const messagesRef = ref(db, 'chats/messages');
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedMessages = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeMessages();
    };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return; // Jangan kirim jika input kosong

    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const messagesRef = ref(db, 'chats/messages');
      await push(messagesRef, {
        text: inputText,
        timestamp: Date.now(),
        sender: 'user',
        username: username || 'Anonymous',
        userId: user.uid
      });
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Render tiap pesan
  const renderItem = ({ item }) => {
    const isMyMessage = item.userId === (user && user.uid);
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
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
      {/* Header sederhana */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"\u25C0"} Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Grup</Text>
      </View>

      {/* Daftar pesan */}
      {loading ? (
        <ActivityIndicator size="large" color="#C9A574" style={styles.loader} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.messagesList}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Input + tombol send */}
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

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E6C4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9A574',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    marginHorizontal: 10,
    marginBottom: 5,
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
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#49A078',
  },
  otherMessageContainer: {
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
