import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import uri from "./Data";
import { Formik } from "formik";
import * as Yup from 'yup';

const validacion = Yup.object().shape({
    name: Yup.string().required("Este campo es obligatorio."),
    date: Yup.date().required("Este campo es obligatorio."),
});

export default function Actividades() {
    const [token, setToken] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [listactividades, setListActividades] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null); // Estado para la actividad seleccionada
    const [idUser, setIdUser] = useState('');

    const url = uri + '/listactivity';
    const url_post = uri + '/addactivity';
    const url_put = uri + '/updateactivity';

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                    try {
                        const decodedToken = jwtDecode(storedToken);
                        setIdUser(decodedToken.idUser); // Asumimos que el token tiene un campo idUser
                    } catch (decodeError) {
                        console.error('Error al decodificar el token:', decodeError);
                        Alert.alert('¡ERROR!', 'Ocurrió un error al decodificar el token.');
                    }
                } else {
                    Alert.alert('¡ERROR!', 'Token no encontrado. Por favor, inicia sesión de nuevo.');
                }
            } catch (error) {
                console.error('Error al obtener el token:', error);
                Alert.alert('¡ERROR!', 'Ocurrió un error al obtener el token.');
            }
        };
        fetchToken();
    }, []);

    useEffect(() => {
        const showList = async () => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache', // Desactivar caché
                    }
                });
                setListActividades(response.data);
                console.log('Actividades cargadas:', response.data); // Log para verificar los datos cargados
            } catch (error) {
                console.error('Error al cargar actividades:', error);
                Alert.alert('¡ERROR!', 'Ocurrió un error inesperado.' + error.message);
            }
        };
        if (token) {
            showList();
        }
    }, [token]);

    const handleDateConfirm = (date, setFieldValue) => {
        setSelectedDate(date);
        setFieldValue('date', date.toISOString().split('T')[0]); // formato ISO para la fecha
        setDatePickerVisibility(false);
    };

    const addActividad = async (values) => {
        try {
            const response = await axios.post(url_post, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            // Verificar que la respuesta no sea nula antes de actualizar el estado
        if (response.data && response.data.data) {
            setListActividades((prevList) => [...prevList, response.data.data]);
            Alert.alert('¡Éxito!', 'Actividad agregada correctamente.');
        } else {
            console.error('La respuesta del servidor es nula o no contiene datos');
            Alert.alert('¡ERROR!', 'La respuesta del servidor es nula o no contiene datos.');
        }
            setModalVisible(false);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            Alert.alert('¡ERROR!', 'Ocurrió un error inesperado. ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const editActividad = async (values) => {
        try {
            const url = `${url_put}/${selectedActivity._id}`;
            const response = await axios.put(url, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            // Verificar que la respuesta no sea nula antes de actualizar el estado
        if (response.data && response.data.data) {
            setListActividades((prevList) =>
                prevList.map((activity) => (activity._id === selectedActivity._id ? response.data.data : activity))
            );
            Alert.alert('¡Éxito!', 'Actividad actualizada.');
        } else {
            console.error('La respuesta del servidor es nula o no contiene datos');
            Alert.alert('¡ERROR!', 'La respuesta del servidor es nula o no contiene datos.');
        }
            setModalVisible(false);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            Alert.alert('¡ERROR!', 'Ocurrió un error inesperado. ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const deleteActividad = async (id) => {
        try {
            const url = `${uri}/deleteactivity/${id}`;
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // Verificar que la respuesta no sea nula antes de actualizar el estado
        if (response.data && response.data.data) {
            setListActividades((prevList) => prevList.filter((activity) => activity._id !== id));
            Alert.alert('¡Éxito!', 'Actividad eliminada.');
        } else {
            console.error('La respuesta del servidor es nula o no contiene datos');
            Alert.alert('¡ERROR!', 'La respuesta del servidor es nula o no contiene datos.');
        }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            Alert.alert('¡ERROR!', 'Ocurrió un error inesperado. ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const renderItem = ({ item }) => {
            const formattedDate = new Date(item.date).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
    
            return (
                <TouchableOpacity onPress={() => {
                    console.log('Actividad seleccionada:', item); // Log para verificar la actividad seleccionada
                    setSelectedActivity(item);
                    setModalVisible(true);
                }}>
                    <View style={estilos.itemContainer}>
                        <View style={estilos.itemTextContainer}>
                            <Text style={estilos.itemName}>{item.name}</Text>
                            <Text style={estilos.itemDate}>Fecha de entrega: {formattedDate}</Text>
                        </View>
                        <View>
                            <Icon name="chevron-right" size={25} color="black" />
                        </View>
                    </View>
                </TouchableOpacity>
            );
        };

    return (
        <View style={estilos.container}>
            {listactividades.length > 0 ? (
                <FlatList
                    data={listactividades}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            ) : (
                <View style={estilos.noActivitiesContainer}>
                    <Text style={estilos.noActivitiesText}>¡Vaya!, parece que no tienes actividades...
                    </Text>
                    <Image 
                        source={{ uri: 'https://media.tenor.com/at27bgtYrKsAAAAi/purple-bat.gif' }} 
                        style={estilos.noActivitiesImage} 
                    />
                </View>
            )}

            <TouchableOpacity
                style={estilos.floatingActionButton}
                onPress={() => 
                    {setModalVisible(true);
                    setSelectedActivity(null);
                    }}
            >
                <Icon name="plus" size={30} color="white" />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={estilos.modalOverlay}>
                    <View style={estilos.modalContent}>
                        <Formik
                            initialValues={{
                                name: selectedActivity ? selectedActivity.name : '',
                                description: selectedActivity ? selectedActivity.description : '',
                                date: selectedActivity ? selectedActivity.date.split('T')[0] : '', // Formato ISO para la fecha
                                status: selectedActivity ? selectedActivity.status : false,
                                idUser: idUser,
                            }}
                            validationSchema={validacion}
                            onSubmit={(values, { resetForm }) => {
                                if (selectedActivity) {
                                    // Actualizar actividad
                                    editActividad(values);
                                } else {
                                    // Agregar actividad
                                    addActividad(values);
                                }
                                resetForm();
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                                <View>
                                    <Text style={estilos.modalTitle}><Icon name='pen' size={22}/> {selectedActivity ? "Editando...":"Nueva actividad"}</Text>
                                    <Icon
                                        name="close"
                                        size={25} 
                                        color="black" 
                                        onPress={() => setModalVisible(false)} 
                                        style={{position: 'absolute', right: 1, top: 2}}
                                    />
                                    <Text style={estilos.inputLabel}>Titulo:</Text>
                                    <TextInput
                                        style={estilos.input}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                    />
                                    {touched.name && errors.name && <Text style={estilos.errorText}>{errors.name}</Text>}
                                    <Text style={estilos.inputLabel}>Descripción:</Text>
                                    <TextInput
                                        style={estilos.input}
                                        onChangeText={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                        placeholder='(opcional)'
                                        value={values.description}
                                    />
                                    <Text style={estilos.inputLabel}>Fecha de entrega:</Text>
                                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={estilos.input}>
                                        <Text><Icon
                                            name='calendar-month'
                                            size={15}
                                            >
                                            </Icon> {values.date}</Text>
                                    </TouchableOpacity>
                                    <DateTimePicker
                                        isVisible={isDatePickerVisible}
                                        mode="date"
                                        onConfirm={(date) => handleDateConfirm(date, setFieldValue)}
                                        onCancel={() => setDatePickerVisibility(false)}
                                        minimumDate={new Date()}
                                    />
                                    {touched.date && errors.date && <Text style={estilos.errorText}>{errors.date}</Text>}
                                    <TouchableOpacity onPress={handleSubmit} style={estilos.button}>
                                        <Text style={estilos.buttonText}>
                                            <Icon
                                            name='content-save'
                                            size={15}
                                            >
                                            </Icon>{selectedActivity ? " Actualizar":" Guardar"}</Text>
                                    </TouchableOpacity>
                                    <View style={estilos.iconContainer}>
                                        {selectedActivity ? (
                                            <>
                                            <Icon 
                                            name='trash-can'
                                            style={{ backgroundColor: 'red', padding: 5, borderRadius: 50}}
                                            size={25}
                                            color='white'
                                            onPress={() => {
                                                if (selectedActivity) {
                                                    Alert.alert(
                                                        'Eliminar actividad',
                                                        '¿Estás seguro de que deseas eliminar esta actividad?',
                                                        [
                                                            {text: 'Cancelar', onPress: () => console.log('Cancelado')},
                                                            {text: 'Eliminar', onPress: () => {
                                                                deleteActividad(selectedActivity._id);
                                                                setModalVisible(false);
                                                            }},
                                                        ],
                                                        {cancelable: false},
                                                    );
                                                }
                                            }}
                                            >
                                        </Icon>
                                        <Icon
                                        name='check'
                                        size={25}
                                        color='white'
                                        style={{backgroundColor: 'green', padding: 5, borderRadius: 50,}}
                                        onPress={() => {
                                            if (selectedActivity) {
                                                Alert.alert(
                                                    'Actividad completada',
                                                    '¿Estás seguro de que deseas marcar esta actividad como completada?',
                                                    [
                                                        {text: 'Cancelar', onPress: () => console.log('Cancelado')},
                                                        {text: 'Aceptar', onPress: () => {
                                                            // funcion para marcar actividad como completada
                                                            setModalVisible(false);
                                                        }},
                                                    ],
                                                    {cancelable: false},
                                                );
                                            }
                                        }}
                                        >
                                        </Icon>
                                        <Icon
                                        name='email'
                                        size={25}
                                        color='white'
                                        style={{backgroundColor: 'gray', padding: 5, borderRadius: 50}}
                                        onPress={() => {
                                            if (selectedActivity) {
                                                Alert.alert(
                                                    'Activar recordatorio',
                                                    'Al activar esta opción se te recordará semanalmente tus actividades pendientes por medio de tu correo, ¿Estás de acuerdo?',
                                                    [
                                                        {text: 'Cancelar', onPress: () => console.log('Cancelado')},
                                                        {text: 'Aceptar', onPress: () => {
                                                            // funcion para enviar correo
                                                            setModalVisible(false);
                                                        }},
                                                    ],
                                                    {cancelable: false},
                                                );
                                            }
                                        }}>
                                        </Icon>
                                        </>
                                        ) : (
                                            null
                                        )}
                                    
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


//estilos de la pantalla de actividades
const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'transparent'
    },
    floatingActionButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8, // Añade sombra en Android
        shadowColor: '#000', // Añade sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: '#596afe',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 5,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    button: {
        backgroundColor: '#596afe',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        marginTop: -15,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
    itemDate: {
        fontSize: 12,
        color: '#999',
    },
    noActivitiesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noActivitiesText: {
        fontSize: 20,
        textAlign: 'center',
    },
    noActivitiesImage: {
        width: 115,
        height: 100,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal:20,
    },
});