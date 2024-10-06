import { View, Text,TextInput,Button,Alert,Modal,TouchableOpacity,StyleSheet, Image, ScrollView } from 'react-native'
import React from 'react';
import { Formik } from "formik";
import * as Yup from 'yup';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';
import uri from "./Data";
import { useNavigation } from "@react-navigation/native";
import CustomButton from './BotonCustomizado'; 
const validacion = Yup.object().shape({
    name: Yup.string().typeError("El nombre debe ser en texto").required("Digite su nombre"),
    email: Yup.string().email('debe ser un correo').required("Debe digitar su correo"),
    password: Yup.string().typeError("la contraseña debe ser una cadena de texto").required("Digite su contraseña"),
      
  });

export default function RegistroUsuario() {
  const navigation = useNavigation();
    //para el dispositivo fisico
    const url_post = uri + '/adduser';
    
  //const url= 'http://localhost:3001/api/adduser'
  //para el emulador
  //const url = 'http://10.0.2.2:3001/api/adduser';

      const agregarusuario = async(values)=>{
        try {
          const response = await axios.post(url_post, {
            name: values.name,
            email: values.email,
            password: values.password
          });
          //Alert.alert('¡Éxito!',response.data.message);
         


          navigation.navigate('VerificacionCorreo');
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
          const errorMessage = error?.response?.data?.message || 'Problemas al realizar el registro intenta mas tarde';
      Alert.alert('¡ERROR!', errorMessage);  
        } else if (error.request) {
            
            Alert.alert('¡ERROR!', 'Revisa tu conexión a Internet.');
        } else {
            
            Alert.alert('¡ERROR!', 'Ocurrió un error en la solicitud.');
        }
    } else {
        
        Alert.alert('¡ERROR!', 'Ocurrió un error inesperado.');
    }
}
      };
  return (
    <ScrollView>
    <Formik  StyleSheet={estilo.contenedor}
    initialValues={{ name: '', email: '', password: '' }}
    validationSchema={validacion}
    onSubmit={agregarusuario}>
         {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View  style={estilo.caja}>
          <Text style={estilo.tittle}>Registro de Usuario <Icon name="account-plus" size={24}/>  </Text>
          <Image source={require('../img/logo_kalmp.jpg')} style={estilo.image}/>
            <TextInput style={estilo.input}
            placeholder="Nombre"
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
          />
          {errors.name && touched.name && (
            <Text style={estilo.error}>{errors.name}</Text>
          )}
           <TextInput style={estilo.input}
            placeholder="Correo Electrónico"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
          />
          {errors.email && touched.email && (
            <Text style={estilo.error}>{errors.email}</Text>
          )}
            <TextInput style={estilo.input}
                placeholder="Contraseña"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry/>
                 {errors.password && touched.password && (
            <Text style={estilo.error}>{errors.password}</Text>
          )}
         

     {/*<Button title="Registrar" onPress={handleSubmit} />*/}
     <CustomButton onPress={handleSubmit} title="Registrar">
       {/*<Text style={estilo.botonText}>Registrar</Text>
       <Icon name="account-plus" size={24}/>*/}
      </CustomButton>

      <Text style={estilo.advice} onPress={() => navigation.navigate('VerificacionCorreo')}>¿No te verificastes? Verificate</Text>
        </View>
      )}
    </Formik>
    </ScrollView>


  )
}
const estilo=StyleSheet.create({
  contenedor:
  {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',

  },
  tittle:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
     alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 100, 
  },

  input:{
    borderWidth:1,
    borderColor: '#dddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical:10,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    marginTop:1,
    //sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  
  },
  caja:{marginTop:20,
    marginLeft: 15,
    marginRight:15,
    //backgroundColor: '#dddd',
   // borderColor:'#dddd',
    justifyContent: 'center',
    padding:20,
    borderRadius: 20,
    
    
  },
  icono:{
    color: '#fff',
    fontSize: 24,
    marginLeft: 10,
  },
  error:{
    color:'red',
    marginBottom: 10,
    fontSize: 14,
   marginLeft: 10,

  },
  advice: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'semibold',
    marginTop: 20,
  },

})