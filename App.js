import 'react-native-gesture-handler';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      console.log('token: '+storedToken);
      setToken(storedToken);
      setLoading(false);
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
            headerRight: () => (
              <Button onPress={handleLogout} title="Cerrar Sesión" />
            ),
            headerShown: true
          }}>
            {() => <Stackdatos initialRouteName="Home1" setToken={setToken} />}
          </Tab.Screen>
            <Tab.Screen name='Chatbot' component={Chatbot} options={{
            tabBarIcon: ({size,color}) => (
              <Icon name="chat" size={size} color={color}/>
            ),
            headerShown: false
            }}/>
            <Tab.Screen name="Configuración" component={Config} options={{
            tabBarIcon: ({size,color}) => (
              <Icon name="cog" size={size} color={color}/>
            ),
            headerShown: false
            }}/>
          </Tab.Navigator>
        ) : (
        <Stackdatos initialRouteName="InicioSesion" setToken={setToken}/>
        )}
    </NavigationContainer>
    
   
  );
}

export default App;