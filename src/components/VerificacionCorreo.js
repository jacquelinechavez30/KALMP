import { View, Text,TextInput,Button,Alert, StyleSheet, Image,ScrollView } from 'react-native'
import React from 'react'
import { Formik } from "formik";
import * as Yup from 'yup';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';
import uri from "./Data";
import { useNavigation } from '@react-navigation/native';
import CustomButton from './BotonCustomizado'; 

const validacion = Yup.object().shape({
    email: Yup.string().email('debe ser un correo').required("Debe digitar su correo"),
    code: Yup.string().typeError("la contraseña debe ser una cadena de texto").required("Digite su codigo"),
      
  });



export default function VerificacionCorreo() {
  const url_post = uri + '/verifyuser';
  const navigation = useNavigation();
  const verificacion = async(values)=>{
    try {
      const response = await axios.post(url_post, {
        email: values.email,
        code: values.code
      });
      //Alert.alert('¡Éxito!', response.data.message);
      
      navigation.navigate('Inicio de Sesión');
    } catch (error) {
      //console.error('Error en la respuesta:', error.response?.data);
      if (axios.isAxiosError(error)) {
        if (error.response) {
      const errorMessage = error?.response?.data?.message || 'Problemas al realizar la verificación intenta mas tarde';
      Alert.alert('¡ERROR!', errorMessage);
    } else if (error.request) {
            
      Alert.alert('¡ERROR!', 'Revisa tu conexión a Internet.');
  } else {
      
      Alert.alert('¡ERROR!', 'Ocurrió un error en la solicitud.');
  }
} else {
  
  Alert.alert('¡ERROR!', 'Ocurrió un error inesperado.');
  };
}
}

  return (
    <View>
      <ScrollView>
      <Formik style={estilo.contenedor} 
    initialValues={{ email: '', code: '' }}
    validationSchema={validacion}
    onSubmit={verificacion}>
         {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View  style={estilo.caja}><Text style={estilo.tittle}>Verificacion del correo <Icon name="email-check-outline" size={24}/>  </Text>
        <Image source={require('../img/logo_kalmp.jpg')} style={estilo.image}/>
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
                placeholder="Codigo"
                value={values.code}
                onChangeText={handleChange('code')}
                onBlur={handleBlur('code')}
                secureTextEntry/>
                 {errors.code && touched.code && (
            <Text style={estilo.error}>{errors.code}</Text>
          )}

          <CustomButton title="Verificar" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
    </ScrollView>
    </View>
  
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
  caja:{marginTop:40,
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

  }

})