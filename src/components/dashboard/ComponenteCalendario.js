import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';


const MyCalendar = ( {dayNames} ) => {

    const [markedDates, setMarkedDates] = useState({});
    
    const getSpecificDay = (dayNumber, year, month) => {
        let days = [];
        let date = new Date(year, month, 1);

        while(date.getMonth() === month) {
            if(date.getDay() === dayNumber) {
                let formattedDate = date.toISOString().split('T')[0]; //Formato de fecha: yyyy-mm-dd
                days.push(formattedDate);
            }

            date.setDate(date.getDate() + 1);
        }
        return days;
    }


    let dayNumber = [];

    const setDayNumbers = (dayNames) => {
        if(dayNames !== undefined) {
            dayNames.map((dayName) => {
    
                switch(dayName) {
                    case "Lunes":
                        dayNumber.push(1);
                        break;
                    case "Martes":
                        dayNumber.push(2);
                        break;
                    case "Miércoles":
                        dayNumber.push(3);
                        break;
                    case "Jueves":
                        dayNumber.push(4);
                        break;
                    case "Viernes":
                        dayNumber.push(5);
                        break;
                    case "Sábado":
                        dayNumber.push(6);
                        break;
                    case "Domingo":
                        dayNumber.push(0);
                        break;
                }
            });
        } else 
            console.log("No hay días en el calendario");    
    }

    
    
    useEffect(() => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();

        setDayNumbers(dayNames);

        const days = dayNumber.reduce((acc, day) => {
            const specificDays = getSpecificDay(day, year, month);
            return acc.concat(specificDays);
        }, []);
        
        //Crea el objeto markedDate

        const newMarkedDates = {};
        days.forEach((day) => {
            newMarkedDates[day] = {selected: true, marked:true, selectedColor: 'blue'};
        });

        setMarkedDates(newMarkedDates);
    }, [dayNames]);
    
    return (
        <>
            {markedDates ? (
                <Calendar markedDates={markedDates} onDayPress={(day) => console.log(day)}/>
            ):(
                <Text>No hay días en el calendario</Text>
            )}
        </>
    );
}

export default MyCalendar;