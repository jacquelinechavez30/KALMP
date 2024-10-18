import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, ScrollView, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import uri from "../Data";
import axios from 'axios';


const ComponenteActividades = ({token, idUser}) => {
    const [activities, setActivities] = useState([]);

    const url_get_activity = uri + '/listactivity/' + idUser;

    let flagWarningActividad = false;

    
    if(activities.length === 0) {
        flagWarningActividad = false;
    }else if(activities.length > 0) {
        flagWarningActividad = true;
    }


    if(activities) {
        const valueToFind = "T";
        activities.map((activity) => {
            
            const startingPoint = activity.date.indexOf(valueToFind);

            if(startingPoint !== -1) {
                activity.date = activity.date.substring(0, startingPoint);
            }
        });
    }


    const retrieveActivities = async () => {
        try {
            const response = await axios.get(url_get_activity, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.length > 0) {
                setActivities(response.data);
            }
            else {
                console.log("No hay actividades");
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        retrieveActivities();
    }, []);

    return (
        <>
            <ScrollView style={{maxHeight:400}} nestedScrollEnabled={true}>
            {(flagWarningActividad) ? (
                activities.map((activity, index) => {
                    return (
                        <View key={activity._id} style={styles.container}>
                            <View>
                                <View style={styles.containerNameActivity}>    
                                    
                                    <View style={{flex:1,}}>
                                    <Text 
                                    style={styles.title}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    >
                                        {activity.name}
                                    </Text>
                                    </View>
                                    
                                </View>
                                <View style={{height:50, width:200}}>
                                <Text 
                                style={styles.description}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                >
                                    {activity.description}
                                </Text>
                                </View>
                                <View>
                                    <Text style = {styles.date}>Vence: {activity.date}</Text>
                                </View>
                            </View>

                            <View style={{borderRadius:20,flex:2, alignItems:'center'}}>
                                <Icon name="call-made" style={styles.iconToGo} size={40} color="#4E26FC" />
                            </View>
                            
                        </View>
                    )
                })
            ) : (
                <Text style={styles.title}>No tienes ninguna actividad.</Text>
            )}
            </ScrollView>
        </>
    );
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
        gap: 50,
        paddingTop:20,
        paddingBottom:20,
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
        //show at the end of the container
        alignSelf: 'flex-end',
        marginRight:30,
        marginTop:30,
    },
    containerNameActivity: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap:10,
    }
})

export default ComponenteActividades;