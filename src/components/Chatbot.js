import { View, Text,TextInput, SafeAreaView,Button,FlatList,TouchableOpacity,StyleSheet } from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Chatbot() {
    //arreglos para el mensaje de prueba  en ambos lados(usuario y chatbot)
    //arreglo para el chat  
    const [chat, setChat]= useState("")
    //arreglo para el usuario
    const [usuario, setUsuario]= useState("");
    const Enviar_mensaje_usuario=()=>{
        if(usuario.trim()){
            const usuario_mensaje={
                mensaje: usuario,
                quien: 'usuario'
            };
              //agregando nuevo mensaje al chat  de parte de usuario
            setChat(agregarmensaje=>[...agregarmensaje,usuario_mensaje]);

            setTimeout(()=>{
                //respuesta del chatbot
                const chatbot={
                   mensaje: 'Hola soy tu asistente virtual de tareas en que puedo ayudarte', 
                   quien: 'chatbot'
                };
                //agregando nueva mensaje al chat  de parte de chatbot
                setChat(agregarmensaje=>[...agregarmensaje, chatbot]);
                
            },1000)
            setUsuario("");


        }
    };

    //para determinar los estilos dependiendo quien es si es chatbot o usuario
    const estilo= ({item})=>{
        let diseño_mensaje;
        let iconodequien;
        if(item.quien==='usuario'){
            //estilo usuario
            //por el momento no hay estilo 
            diseño_mensaje=diseño.mensajedelusuario;
            iconodequien=<Icon name="account" size={30} color="#000" />;

    }
    else{
        //estilo del chatbot
         diseño_mensaje=diseño.mensajedelchatbot;
        iconodequien = <Icon name="robot" size={30} color="#000" />;

       
    }return (
        //sin estilo 
        <View style={[diseño.mensaje, diseño_mensaje]}>
            <View style={[diseño.informaciondelmensaje]}>
             <Text >{item.mensaje}</Text>
             </View>
             <View style={diseño.icono}>
            <Text > {iconodequien}</Text>
            </View>
        </View>
    );};


  return (
     <SafeAreaView style={diseño.contenedor}>
        <FlatList 
        data={chat}
        renderItem={estilo}
        keyExtractor={(item, index) => index.toString()}
        style={diseño.chat}/>
        <View style={diseño.contenedorInput}>
            <TextInput
            placeholder="Escribe un mensaje"
            onChangeText={setUsuario}
            value={usuario}
            style={diseño.input}
            />
            <TouchableOpacity 
              //icon={< Icon name="arrow-right-thin-circle-outline" size={30} color="black" />}
            onPress={Enviar_mensaje_usuario} 
            style={diseño.boton}
          >
            < Icon name="arrow-right-thin-circle-outline" size={30} color="black"></Icon>
            </TouchableOpacity>
</View>
</SafeAreaView>

  )
}
//Estilo
const diseño=StyleSheet.create({
    contenedor:{
        backgroundColor : '#fff',
        flex: 1,
    },

    chat:{
        padding: 10,
        flex: 1,

    },
    mensaje:{
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
         flexDirection: 'row',
         alignItems: 'center',
         flexShrink: 1,
        //alignSelf: 'flex-start',
    },
    mensajedelusuario:{
        alignSelf:'flex-end',
        //color morado palido
         backgroundColor: '#F5B7F5',
        
    },
    mensajedelchatbot:{
        alignSelf:'flex-start',
         backgroundColor: '#90CAF9',
        
      
    },
    informaciondelmensaje:{
        fontSize:16,
    },
    input:{
        flex:1,
        borderWidth:1,
        borderColor: '#dddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical:10,
        backgroundColor: '#F5F5F5',
        
    },
    contenedorInput:{
        flexDirection: 'row',
        padding: 10,
        borderTopWidth:1,
        borderColor: '#dddd',
        
        
    },
    boton:{
        borderRadius:50,
        padding: 10,
        //verde claro
        backgroundColor: '#009688',
        marginLeft: 10,
        justifyContent: 'center'
    },
    icono:{
        marginLeft: 23,
       padding: 8,
        //verde  palido
        backgroundColor: '#C6E2B5',
        borderRadius: 50,
        borderWidth: 1,
       


    }




});