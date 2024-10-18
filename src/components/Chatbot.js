import { View, Text, TextInput, SafeAreaView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Data from './Data';
import axios from 'axios';

const url_chatbot = Data + '/chatbot/makeAQuestion';

export default function Chatbot({ token, userId }) {
    const [chat, setChat] = useState([]);
    const [usuario, setUsuario] = useState("");

    const Enviar_mensaje_usuario = async () => {
        if (usuario.trim()) {
            const usuario_mensaje = {
                mensaje: usuario,
                quien: 'usuario'
            };
            // Agregar nuevo mensaje al chat de parte del usuario
            setChat(prevChat => [...prevChat, usuario_mensaje]);

            try {
                // Enviar mensaje al chatbot
                const response = await axios.post(url_chatbot, {
                    message: usuario,
                    userId: userId // Enviar el ID del usuario
                }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Incluir el token en los encabezados
                    }
                });

                // Respuesta del chatbot
                const chatbot_respuesta = {
                    mensaje: response.data.response || 'No tengo respuesta para eso.',
                    quien: 'chatbot'
                };

                // Agregar nueva respuesta al chat de parte del chatbot
                setChat(prevChat => [...prevChat, chatbot_respuesta]);
            } catch (error) {
                console.error('Error al enviar mensaje al chatbot:', error);

                // Manejar errores de la API
                const errorMensaje = {
                    mensaje: 'Error al comunicarse con el chatbot.',
                    quien: 'chatbot'
                };

                setChat(prevChat => [...prevChat, errorMensaje]);
            }

            setUsuario(""); // Limpiar el campo de entrada
        }
    };

    // Para determinar los estilos dependiendo de quién es el mensaje
    const estilo = ({ item }) => {
        let diseño_mensaje;
        let iconodequien;

        if (item.quien === 'usuario') {
            diseño_mensaje = diseño.mensajedelusuario;
            iconodequien = <Icon name="account" size={30} color="#000" />;
        } else {
            diseño_mensaje = diseño.mensajedelchatbot;
            iconodequien = <Icon name="robot" size={30} color="#000" />;
        }

        return (
            <View style={[diseño.mensaje, diseño_mensaje]}>
                <View style={[diseño.informaciondelmensaje]}>
                    <Text>{item.mensaje}</Text>
                </View>
                <View style={diseño.icono}>
                    <Text>{iconodequien}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={diseño.contenedor}>
            <FlatList
                data={chat}
                renderItem={estilo}
                keyExtractor={(item, index) => index.toString()}
                style={diseño.chat}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
            <View style={diseño.contenedorInput}>
                <TextInput
                    placeholder="Escribe un mensaje"
                    onChangeText={setUsuario}
                    value={usuario}
                    style={diseño.input}
                />
                <TouchableOpacity onPress={Enviar_mensaje_usuario} style={diseño.boton}>
                    <Icon name="arrow-right-thin-circle-outline" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Estilo
const diseño = StyleSheet.create({
    contenedor: {
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: 20
    },
    chat: {
        padding: 10,
        flex: 1,
    },
    mensaje: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    mensajedelusuario: {
        alignSelf: 'flex-end',
        backgroundColor: '#F5B7F5',
    },
    mensajedelchatbot: {
        alignSelf: 'flex-start',
        backgroundColor: '#90CAF9',
    },
    informaciondelmensaje: {
        fontSize: 16,
        textAlign: 'justify',
        flexShrink: 1,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#dddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#F5F5F5',
    },
    contenedorInput: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#dddd',
        paddingTop: 20
    },
    boton: {
        borderRadius: 50,
        padding: 10,
        backgroundColor: '#009688',
        marginLeft: 10,
        justifyContent: 'center'
    },
});
