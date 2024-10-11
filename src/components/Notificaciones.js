import { View, Text, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import uri from "./Data";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notificaciones() {
  const [email, setEmail] = useState('');
  const url_post = uri+'/notificacion';

    useEffect(() => {
        const obtenerEmail = async () => {
            const correo = await AsyncStorage.getItem('email');
            if (correo) {
                setEmail(correo);  
            }
        };

        obtenerEmail();
    }, []);

    const enviarCorreo = async () => {
        if (!email) {
            Alert.alert('¡ERROR!', 'No se ha encontrado un correo para enviar.');
            return;
        }

        try {
          const response = await axios.post(url_post, { email });
          console.log(response);
          Alert.alert('Correo enviado', 'Se ha enviado el correo correctamente');
      } catch (error) {
          if (error.response) {
              console.error('Error del servidor:', error.response.data);
          } else if (error.request) {
              console.error('No se recibió respuesta del servidor:', error.request);
              //Alert.alert('¡ERROR!', 'No se recibió respuesta del servidor');
          } else {
              console.error('Error al configurar la solicitud:', error.message);
              //Alert.alert('¡ERROR!', 'Error al configurar la solicitud');
          }
        }
    };
  return (
    <View>
      <Text>Notificaciones</Text>
      <Text>Correo de inicio de sesión: {email}</Text>
      <Button title="Enviar notificaciones" onPress={enviarCorreo} />


      
    </View>
  )
}