import { View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DetectHourTime } from '../DetectHourTime.js';
import ComponenteActividades from './dashboard/ComponenteActividades.js';
import ComponenteHorarios from './dashboard/ComponenteHorarios.js';
import MyCalendar from './dashboard/ComponenteCalendario.js';


const Home = () => {
  const [token, setToken] = useState(null);
  const [decoded, setDecoded] = useState(null); 
  const [refreshing, setRefreshing] = useState(false);
  const [daysInCalendar, setDaysInCalendar] = useState([]);

  const hourTime = DetectHourTime();
  let saludo = "";
  let isSunny = false
  switch(hourTime){
    case 'mañana':
      saludo = '¡Buenos Días!';
      isSunny = true;
      break;
    case 'tarde':
      saludo = '¡Buenas Tardes!';
      isSunny = true;
      break;
    case 'noche':
      saludo = '¡Buenas Noches!';
      isSunny = false;
      break;
    default:
      saludo = '¡Buenos Días!';
      isSunny = true;
      break;
  }

  console.log("Calendar days en Home.js" + daysInCalendar);
  
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setToken(token);

      if (token) {
        setDecoded(jwtDecode(token));
        console.log(decoded);
      } else {
        console.log('No hay token');
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    
    getToken();
  }, []);


  const handleRefresh = () => {
    setRefreshing(true);
    getToken().finally(() => setRefreshing(false));
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
      <ScrollView style={styles.scrolleableParent} nestedScrollEnabled={true} refreshControl={
         
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} /> 
      }>
      <View style = {styles.container}>
        <View style={{paddingLeft:20, paddingTop:15,}}>
          {isSunny ? (
            <Icon name="weather-sunny" size={50} color="#596bff" />
          ) : (
            <Icon name="weather-night" size={50} color="#596bff" />
          )
          }
          <Text style={{ fontSize: 20, fontWeight: 'medium' }}>{saludo}</Text>
        </View>
        {decoded && <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 20 }}>{decoded.name}</Text>}
      </View>


      <View>
      <View style = {styles.activityText}>
        <Text style={{fontSize : 20, fontWeight:'bold', paddingTop: 15}}>Mis Eventos</Text>
        <Icon name="calendar-weekend" size={50} color="#F7647C" />
        </View>

        
          <MyCalendar daysInCalendar = {daysInCalendar} />
        
      </View>


      <View style={styles.activityContainer}>
        <View style = {styles.activityText}>
        <Text style={{fontSize : 20, fontWeight:'bold', paddingTop: 15}}>Mis Tareas</Text>
        <Icon name="book" size={50} color="#F7647C" />
        </View>
        <ScrollView style={styles.innerScrollView} nestedScrollEnabled={true}>
              {decoded && <ComponenteActividades token={token} idUser={decoded.idUser} />}
          </ScrollView>


        <View style = {styles.activityText}>
        <Text style={{fontSize : 20, fontWeight:'bold', paddingTop: 15}}>Mis Horarios</Text>
        <Icon name="calendar-month" size={50} color="#F7647C" />
        </View>

        <ScrollView style={styles.innerScrollView} nestedScrollEnabled={true}>
              {decoded && <ComponenteHorarios token={token} idUser={decoded.idUser} setDaysSchedule={setDaysInCalendar}/>}            
          </ScrollView>
      </View>



</ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5FA',
    marginLeft: 10,
    marginRight: 10,
    borderRadius:10,
    padding:10,
    paddingBottom:20,
    borderBottomWidth:1, borderBottomColor:'#ccc'
  },
  scrolleableParent: {
    flex: 1,
    marginTop: 30,
  },
  activityContainer: {
    borderRadius:10,
    padding:10,
    paddingBottom:20,
    borderBlockColor: '#F5F5FA',
    marginTop:10,
  },
  scheduleContainer :{
    padding:10,
    paddingBottom:20,
    borderBlockColor: '#F5F5FA',
    marginTop:20,
    backgroundColor: 'black',
  },
  activityText : {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    
  },
  innerScrollView: {
    flex:1,
  },
});