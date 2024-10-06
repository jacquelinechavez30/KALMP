import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

const Notificaciones = ({ titulo, cuerpo, datos }) => {
  const [tokenNotificacion, setTokenNotificacion] = useState('');

  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permisos no concedidos', 'No se pueden enviar notificaciones sin permisos.');
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync({
          projectId: 'a46893f9-5cbf-4f7b-9a40-92441804d0e7',
        })).data;

        console.log('Token de notificación:', token);
        setTokenNotificacion(token);

        if (token) {
          enviarNotificacion(token);
        }
      } catch (error) {
        console.error('Error al obtener el token de notificación:', error);
      }
    };

    obtenerToken();
  }, [titulo, cuerpo]);

  const enviarNotificacion = async (token) => {
    const mensaje = {
      to: token,
      sound: 'default',
      title: titulo || 'Titulo',
      body: cuerpo || 'Contenido',
      
    };

    try {
      await axios.post('https://exp.host/--/api/v2/push/send', mensaje, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log(mensaje);
    } catch (error) {
      console.error('Error enviando la notificación:', error);
    }
  };

  return;
};

export default Notificaciones;
