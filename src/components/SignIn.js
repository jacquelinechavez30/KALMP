import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Yup from 'yup';
import uri from "./Data";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Por favor ingresa un correo electrónico válido')
        .required('El correo electrónico es obligatorio'),
    password: Yup.string()
        .required('La contraseña es obligatoria'),
  });
  //Ocultar el teclado
  const cerrarTeclado = () => {
    Keyboard.dismiss();
  }

const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    

    //make a form with formik and yup asking for email and password and a button to send the data using the function I created below
    //the function is called catchToken

    const SignUserIn = async () => {
        axios.post('http://localhost:3001/api/login', {
            email: email,
            password: password
        }).then( async (response) => {
            console.log(response.data);
            if (response.data.success === false) {
                setError(response.data.message);
                console.log('Hemos caído en un error del backend: ', response.data.message);
            } else {
                setError('');
                //Store in the async storage the token
                await AsyncStorage.setItem('token', response.data.token);
                console.log('Token almacenado:', response.data.token);
            }
        }).catch((error) => {
            setError('Error en el servidor');
        }
        )
    }


  return (
    <>
    <Text style={styles.title}>Inicio de Sesión</Text>
    </>
  )
}

export default SignIn;

const styles = StyleSheet.create({
    container : {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 20,
        marginVertical: 10
    },
    form: {
        marginVertical: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff'
    },
    error: {
        color: 'red'
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10
    }
})