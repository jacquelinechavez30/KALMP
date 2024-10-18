import 'react-native-gesture-handler';
import * as React from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Config from './src/Config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Chatbot from './src/components/Chatbot';
import InicioSesion from './src/components/InicioSesion';
import Stackdatos from './src/Stackdatos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Button } from 'react-native';
import RegistroUsuario from './src/components/RegistroUsuario';

const Tab = createBottomTabNavigator();

const App = () => {

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setuserId] = useState(null)
  const [payload, setPayload] = useState(null);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId')
      console.log('token: ' + storedToken);
      console.log('userId: ' + storedUserId)
      setToken(storedToken);
      setuserId(storedUserId)
      setLoading(false);

      if (storedToken) {
        const decodePayload = jwtDecode(storedToken);
        setPayload(decodePayload);
        console.log('payload: ' + decodePayload);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (token === null) {
      console.log('Sesión cerrada: ' + token);
    }
  }, [token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <NavigationContainer >
      {token ? (
        <Tab.Navigator>
          <Tab.Screen name="Home" options={{
            tabBarIcon: ({ size, color }) => (
              <Icon name="home" size={size} color={color} />
            ),
            headerLeft: () => (
              <TouchableOpacity style={{ marginLeft: 20, backgroundColor: '#596bff', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10, borderRadius: 10 }} onPress={handleLogout}>
                <Text style={{ color: 'white' }}>Cerrar Sesión</Text>
              </TouchableOpacity>
            ),
            headerTitle: "Dashboard",
            headerTitleAlign: 'center',

          }}>
            {() => <Stackdatos initialRouteName="Home1" setToken={setToken} setuserId={setuserId} />}
          </Tab.Screen>
          <Tab.Screen name='Chatbot'
            options={{
              tabBarIcon: ({ size, color }) => (
                <Icon name="chat" size={size} color={color} />
              ),
              headerShown: false
            }}>
            {() => <Chatbot token={token} userId={userId} />}
          </Tab.Screen>
          
          <Tab.Screen name="Configuración" component={Config} options={{
            tabBarIcon: ({ size, color }) => (
              <Icon name="cog" size={size} color={color} />
            ),
            headerShown: false
          }} />
         
        </Tab.Navigator>
      ) : (
        <Stackdatos initialRouteName="InicioSesion" setToken={setToken} />
      )}
    </NavigationContainer>


  );
}

export default App;