import { View, Text,TextInput,Button,Alert,Modal, Image, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, {useState} from 'react';
import { Formik } from "formik";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';
import uri from "./Data";
import { useNavigation } from "@react-navigation/native";
import CustomButton from './BotonCustomizado'; // Asegúrate de que la ruta sea correcta
import RNRestart from 'react-native-restart';

const validacion = Yup.object().shape({
    email: Yup.string().email('debe ser un correo').required("Debe digitar su correo"),
    password: Yup.string().typeError("la contraseña debe ser una cadena de texto").required("Digite su contraseña"),
  });

export default function InicioSesion({setToken}) {

  const ocultarTeclado = () => {
    Keyboard.dismiss();
  };

    const navigation = useNavigation();
        //para el dispositivo fisico
        const url_post = uri + '/login';
        
    //const url= 'http://localhost:3001/api/adduser'
    //para el emulador
    //const url = 'http://
    //


    const iniciarSesion = async(values)=>{
        try {
            const response = await axios.post(url_post, {
                email: values.email,
                password: values.password
            });
            console.log(response);
            //Alert.alert('¡Éxito!',response.data.message);
            Alert.alert('Sesión iniciada', '¡Bienvenido a KALMP!');
            if(response.data.token){
                await AsyncStorage.setItem('token', response.data.token);
                setToken(response.data.token);
            }
        } catch (error) {
        Alert.alert('¡ERROR!', error);
        console.error(error);
        } 
    };

    return (
        <>
        <TouchableWithoutFeedback onPress={() => ocultarTeclado()}>
        
        <View style={styles.containerMain}>
            
        <View style={styles.container}>
            <Image source={require('../img/logo_kalmp.jpg')} style={styles.image}/>
        </View>
        <View style={styles.container2}>
        <Formik 
        initialValues={{ email: '', password: '' }}
        validationSchema={validacion}
        onSubmit={iniciarSesion}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View >
                <TextInput
                name="email"
                placeholder="Correo Electrónico"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={styles.input}
                />
                {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
                )}
                <TextInput
                name="password"
                placeholder="Contraseña"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                style={styles.input}
                secureTextEntry
                />
                {errors.password && touched.password && (
                <Text style={styles.error}>{errors.password}</Text>
                )}
                 <CustomButton title="Iniciar Sesión" />
            </View>
            )}
            
        </Formik>
        <Text style={styles.advice} onPress={() => navigation.navigate('Registro Usuario')}>¿No tienes cuenta? Regístrate</Text>
        </View>
        
        
        
        </View>
        
        </TouchableWithoutFeedback>
        </>
    )
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height:30,
      },
      containerMain: {
        flex: 1,
        backgroundColor: '#fff',
        height:30,
      },
      container2: {
        flex: 1,
        height:30,
      },
      image: {
        width: 300,
        height: 300,
        borderRadius: 10,
      },
      input: {
        height: 40,
        margin: 10,
        borderWidth: 0, // Quita el bordeado
        padding: 10,
        backgroundColor: 'white', // Asegúrate de que el fondo sea blanco para que la sombra sea visible
        // Propiedades de sombra para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Propiedad de sombra para Android
        elevation: 5,
        width:'90%',
        borderRadius: 10,
      },
      
      error:{
        color: 'red',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      advice: {
        color: '#000',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'semibold',
        marginTop: 20,
      },
}