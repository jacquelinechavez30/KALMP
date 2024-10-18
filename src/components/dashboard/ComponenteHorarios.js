import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import uri from "../Data";
import axios from 'axios';


const ComponenteHorarios = ({token, idUser, setDaysSchedule} ) => {
    const [schedules, setSchedules] = useState([]);

    const daysInSchedule = [];
    let flagWarningHorario = false;

    if(schedules.length === 0) {
        flagWarningHorario = false;
    }else if(schedules.length > 0) {
        flagWarningHorario = true;
    }

    useEffect(() => {
        retrieveSchedules();
    }, []);

    //Use to correct the repeated days in the schedule by the changing of the state
    useEffect(() => {
        deleteRepeatedDays();
    }, [schedules]);

     //Maps all the schedule's days
     schedules.map((schedule) => {
        daysInSchedule.push(schedule.day);
    });

    const deleteRepeatedDays = () => {
        const uniqueDays = [...new Set(daysInSchedule)];
        setDaysSchedule(uniqueDays);
    };


    
    const url_get_schedules = uri + '/listschedule/' + idUser;

    const retrieveSchedules = async () => {
        try {
            const response = await axios.get(url_get_schedules, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.length > 0) {
                setSchedules(response.data);
                console.log(response.data);
            }
            else {
                console.log("No hay horarios");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <ScrollView style = {{height:400, marginTop: 5}}>
            {(flagWarningHorario) ? (
                schedules.map((schedule, index) => {
                    return (
                        <View key={index} style={styles.container}>
                            <View>
                                <View style={styles.containerNameActivity}>    
                                    <View>
                                        <Icon name="calendar" size={30} color="blue"/>
                                    </View>
                                    <Text style={styles.title}>{schedule.name}</Text>
                                </View>
                                <ScrollView style={{height:50}}>
                                    <Text style = {styles.description}>{schedule.description}</Text>
                                </ScrollView>
                                <View>
                                    <Text style = {styles.date}>Días: {schedule.day}</Text>
                                </View>
                                <View>
                                    <Text style = {styles.date}>Hora: {schedule.hour}</Text>
                                </View>
                            </View>
                            <View style={{borderRadius:20, height: '20', width:100,}}>
                                    <Icon name="call-made" style={styles.iconToGo} size={45} color="#4E26FC" />
                            </View>
                        </View>
                    )
                })
            ) : (
                <Text style={styles.title}>No tienes ningún horario.</Text>
            )}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3FD',
        marginTop:10,
        padding:20,
        borderRadius:10,
        //Display inline flex
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        color:"#596bff",
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color:"black",
        fontWeight: 'bold',
        marginTop: 10,
    },
    date: {
        fontSize: 15,
        color:"#596bff",
        fontWeight: 'bold',
        paddingTop: 10,
    },
    iconToGo: {
        flex: 1,
        //show at the end of the container
        alignSelf: 'flex-end',
    },
    containerNameActivity: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap:10,
    }
})

export default ComponenteHorarios;