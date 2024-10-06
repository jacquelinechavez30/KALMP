import { View, Text,Image,StyleSheet } from 'react-native'
import React from 'react'

export default function Headerformularios() {
  return (
    <View style={header.container}> 
        <Image style={header.image} source={require('../img/logo_kalmp.jpg')} />
      <Text style={header.title}>KALMP</Text>
    </View>
  )
}

const header= StyleSheet.create({
    image: {
        height: 30,
        width: 30,
        marginLeft:15,
        borderRadius: 100,
    },
    container:
    {
        flexDirection:'row',
       alignItems:'center',
       justifyContent:'center',
        height:50,
        marginTop:29,
        backgroundColor: '#596bff',
        //backgroundColor: '#009688',
       // backgroundColor: '#00BCD4',
        
      
    },
    title:{
        flex:1,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
    },

})