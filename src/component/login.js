// src/component/login.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

import { auth, db } from '../../firebaseConfig';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profesi, setProfesi] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [nohp, setNohp] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthentication = async () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
      }
    } else {
      if (!email || !password || !username || !profesi) {
        Alert.alert('Error', 'Please fill all required fields.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters.');
        return;
      }
    }

    try {
      if (isLogin) {
        // LOGIN
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check user role from DB
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.role === 'admin') {
            navigation.navigate('MainScreenAdmin');
          } else if (userData.role === 'user') {
            navigation.navigate('MainScreen');
          } else {
            Alert.alert('Error', 'Role not recognized.');
          }
        } else {
          Alert.alert('Error', 'User data not found in the database.');
        }
      } else {
        // REGISTER
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan data ke Realtime Database
        await set(ref(db, `users/${user.uid}`), {
          username,
          email,
          profesi,
          gender,
          location,
          nohp,
          role: 'user', // Default role user
        });

        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('MainScreen');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      let errorMessage = 'An error occurred. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        default:
          errorMessage = error.message;
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Text style={styles.title}>Mommykost</Text>
        <Text style={styles.houseEmoji}>🏠</Text>
      </View>

      {isLogin ? (
        // Form LOGIN
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(false)}>
            <Text style={styles.linkText}>Or Create a New Account</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Form REGISTER
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Email Id"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Create Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Create Profesi"
              value={profesi}
              onChangeText={setProfesi}
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={gender}
              onChangeText={setGender}
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={nohp}
              onChangeText={setNohp}
              keyboardType="phone-pad"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Create Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(true)}>
            <Text style={styles.linkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5B041',
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#000',
    fontStyle: 'italic',
    marginRight: 5,
  },
  houseEmoji: {
    fontSize: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
