const axios = require('axios');
const routes = require('../routes/index')

const witToken = process.env.BotToken; //token bot

// Simulando almacenamiento en memoria para el estado de la conversación
const conversationState = {};

const handleInteraction = async (req, res) => {
    const { message, userId } = req.body;
    const userToken = req.headers.authorization.split(' ')[1]; //extraemos el token del usuario

    if (!message || !userId || !userToken) {
        return res.status(400).send({ message: 'Message, userId, and userToken are required' });
    }

    // Obtener el estado actual de la conversación para el usuario
    let state = conversationState[userId] || { stage: 'initial' };

    try {
        // Llamando a la api de wit.ia 
        const response = await axios({
            method: 'GET',
            url: 'https://api.wit.ai/message',
            headers: {
                'Authorization': `Bearer ${witToken}`
            },
            params: {
                q: message,
                v: '20200901'
            },
        });

        const data = response.data;
        const { intents } = data;

        let reply;

        //switch de desiciones
        switch (state.stage) {
            case 'initial':
                if (intents.length > 0) {
                    const intent = intents[0].name;
                    switch (intent) {
                        case 'saludos':
                            reply = '¡Hola! ¿En qué puedo ayudarte hoy?';
                            break;
                        case 'despedidas':
                            reply = '¡Adiós! Que tengas un buen día, no dudes en solicitar mi ayuda, para eso estoy aquí :)';
                            break;
                        case 'crear_horario':
                            state = { ...state, stage: 'waiting_for_name' };
                            reply = 'Claro, puedo crear un horario por ti, ¿Que titulo le quieres poner?';
                            break;
                        case 'crear_actividad':
                            state = { ...state, stage: 'waiting_for_activity_name' }
                            reply = 'Claro, puedo crear una actividad por ti, ¿Que titulo le quieres poner?'
                            break
                        default:
                            reply = 'Lo siento, no entiendo esas palabras :(.';
                            break;
                    }
                } else {
                    reply = 'Lo siento, no entiendo esas palabras :(.';
                }
                break;
            case 'waiting_for_name':
                state = { ...state, stage: 'waiting_for_description', scheduleName: message };
                reply = '¿Que descripción deseas colocarle?';
                break;
            case 'waiting_for_description':
                state = { ...state, stage: 'waiting_for_day', scheduleDescription: message };
                reply = '¿Para que día la quieres agendar?';
                break;
            case 'waiting_for_day':
                state = { ...state, stage: 'waiting_for_hour', scheduleDay: message };
                reply = '¿Y para que hora?';
                break;
            case 'waiting_for_hour':
                state = { ...state, stage: 'complete', scheduleHour: message }

                // guardando la data que se vaya ingresando
                const scheduleData = {
                    name: state.scheduleName,
                    description: state.scheduleDescription,
                    day: state.scheduleDay,
                    hour: state.scheduleHour,
                    idUser: userId //guardando el id del usuario 
                };

                //fetch POST
                await axios.post('https://api-app-tareas.onrender.com/api/addschedule', scheduleData, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                reply = '¡Genial!, ya he creado el horario que has solicitado, puedes ir a revisar a tu sección donde tienes todos tus horarios agendados :).';
                // Reiniciar el estado de la conversación
                state = { stage: 'initial' };
                break

            //por si el usuario quiere crear una actividad
            case 'waiting_for_activity_name':
                state = { ...state, stage: 'waiting_for_description_activity', activityName: message }
                reply = '¿Que descripción deseas colocarle?'
                break
            case 'waiting_for_description_activity':
                state = { ...state, stage: 'waiting_for_date_activity', activityDescription: message }
                reply = '¿Para que fecha la deseas agendar?'
                break
            case 'waiting_for_date_activity':
                state = { ...state, stage: 'complete', activityDate: message }

                // Guardando los datos de la actividad
                const activityData = {
                    name: state.activityName,
                    description: state.activityDescription,
                    date: state.activityDate,
                    idUser: userId //guardamos con el id del usuario
                };

                await axios.post('https://api-app-tareas.onrender.com/api/addactivity', activityData, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                reply = '¡Genial!, ya he creado la actividad que me has solicitado, puedes ir a revisar a tu sección donde tienes todas tus actividades agendadas :).';
                // Reiniciar el estado de la conversación
                state = { stage: 'initial' };
                break;

            default:
                reply = 'Lo siento, no entiendo esas palabras :(.';
                state = { stage: 'initial' };
                break;
        }

        // Guardar el estado actualizado de la conversación
        conversationState[userId] = state;

        res.json({ response: reply });

    } catch (error) {
        console.error('Error with Wit.ai API:', error);
        const errorMessage = error.response ? error.response.data : error.message;
        res.status(500).send({ message: 'Error with Wit.ai API', error: errorMessage });
    }
};

module.exports = {
    handleInteraction
};
