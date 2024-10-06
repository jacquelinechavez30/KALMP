import React from "react";
import { Text,View } from "react-native";
import Notificaciones from "./components/Notificaciones";

const Config = () => {
    return(
        <View>
        <Text>Configuraciones</Text>
        <Notificaciones 
        titulo="Título de la notificación de prueba" 
        cuerpo="Cuerpo de la notificación de prueba" />

        </View>
    )
}

export default Config