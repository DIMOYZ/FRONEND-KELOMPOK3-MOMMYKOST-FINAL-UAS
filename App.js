// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';

import { auth, db } from './firebaseConfig';

// Screens (User & Admin)
import HomeScreen from './src/component/welcome';          // File: welcome.js
import AuthScreen from './src/component/login';            // File: login.js
import MainScreen from './src/component/MainScreen';       // File: MainScreen.js
import MainScreenAdmin from './src/component/MainScreenAdmin';
import ManageKostsScreen from './src/component/ManageKostsScreen';
import ProfileScreen from './src/component/ProfilScreen';
import AddKostScreen from './src/component/AddKostScreen';

// Detail Screens (User)
import VVIPDetail from './src/listkost/detailkostvvip';
import VIPDetail from './src/listkost/detailkostvip';
import EkonomiDetail from './src/listkost/detailkostekekkonomi';

// Chat Screens
import AdminChatListScreen from './src/component/AdminChatListScreen';
import AdminChatScreen from './src/component/AdminChatScreen';
import UserChatScreen from './src/component/UserChatScreen';
import ChatScreen from './src/component/ChatScreen';

// Payment Screen (baru ditambahkan)
import PembayaranScreen from './src/listkost/pembayaran'; // <-- Pastikan Anda sudah membuat file ini

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Cek role user di Realtime Database
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        const adminStatus = userData && userData.role === 'admin';
        console.log(`User role: ${userData.role}, isAdmin: ${adminStatus}`); // Debug
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Jika user sudah login
          isAdmin ? (
            // Rute untuk Admin
            <>
              <Stack.Screen name="MainScreenAdmin" component={MainScreenAdmin} />
              <Stack.Screen name="ManageKostsScreen" component={ManageKostsScreen} />
              <Stack.Screen name="AddKostScreen" component={AddKostScreen} />
              {/* Chat Admin */}
              <Stack.Screen name="AdminChatListScreen" component={AdminChatListScreen} />
              <Stack.Screen name="AdminChatScreen" component={AdminChatScreen} />
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
            </>
          ) : (
            // Rute untuk User biasa
            <>
              <Stack.Screen name="MainScreen" component={MainScreen} />
              <Stack.Screen name="VVIPDetail" component={VVIPDetail} />
              <Stack.Screen name="VIPDetail" component={VIPDetail} />
              <Stack.Screen name="EkonomiDetail" component={EkonomiDetail} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="UserChatScreen" component={UserChatScreen} />
              <Stack.Screen name="ChatScreen" component={ChatScreen} />

              {/* Screen Pembayaran yang baru kita tambahkan */}
              <Stack.Screen name="PembayaranScreen" component={PembayaranScreen} />
            </>
          )
        ) : (
          // Jika user belum login
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={AuthScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
