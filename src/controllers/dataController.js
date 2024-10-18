const Data = require('../models/data');
const DataUsers = require('../models/userSchema');
const DataSchedules = require('../models/scheduleSchema');
const DataActivity = require('../models/activitySchema');
const TokenSchema = require('../models/tokensSchema');
const { generateToken, verifyToken } = require('./jwtUtils');
const nodemailer = require('nodemailer');  
const { v4: uuidv4 } = require('uuid');  

exports.last = async (req, res) => {
    try {
        const data = await Data.find({}).sort({ createdAt: -1 }).limit(1);
        return res.status(200).json({ data });
    } catch {
        return res.status(500).send({ message: "Error." });
    }
};

exports.top25 = async (req, res) => {
    try {
        const data = await Data.find({}).sort({ createdAt: -1 }).limit(25);
        return res.status(200).json({ data });
    } catch {
        return res.status(500).send({ message: "Error." });
    }
};

exports.Date_show = async (req, res) => {
    const { initial_date, final_date } = req.body;
    if (!initial_date || !final_date) {
        return res.status(500).send({ message: "Error, se debe introducir fecha de inicio y fin." });
    } else {
        var isDateOK1 = isDateValid(initial_date);
        var isDateOK2 = isDateValid(final_date);

        if (isDateOK1 && isDateOK2) {
            if (Date.parse(initial_date) >= Date.parse(final_date)) {
                return res.status(500).send({ message: "Error, la fecha de inicio tiene que ser mayor a la fecha final." });
            } else {
                var date1 = new Date(initial_date);
                var date2 = new Date(final_date);

                const data = await Data.find({ createdAt: { $gt: date1, $lt: date2 } });
                return res.status(200).send({ initial: date1, final: date2, data: data });

            }
        } else {
            return res.status(500).send({ message: "Error, las fechas tienen que tener el formato válido de fecha, alguna fecha puede estar mala." });
        }
    }
};

function isDateValid(dateStr) {
    var isDateOK = !isNaN(new Date(dateStr)); // true if dateStr is a valid date
    var date = new Date(dateStr);
    if (isDateOK) {
        let day = date.getDate();
        day = day < 10 ? "0" + day : day;
        let month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        const year = date.getFullYear();
        return true;
    } else {
        return false;
    }
};

//Controladores para usuarios

//buscar todos los usuarios
exports.listusers = async (req, res, next) => {
    try {
        const data = await DataUsers.find({});
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(200).send(error);
        next();
    }
};

//añadir usuario
exports.adduser = async (req, res) => {
    const { name, email, password } = req.body;
     // Generar un código de verificación
     const verificationCode = uuidv4();
    const data = new DataUsers({
        name: name || 0,
        email: email || 0,
        password: password || 0,
        code: verificationCode
    });
    try {
       
        const correoexistente = await DataUsers.findOne({ email })|| null;

        if (correoexistente !==null) {
            return res.status(400).json({ message: "El correo ya esta en uso, prueba con uno diferente" });
        }
       
        //configuración del correo
        const transporter = nodemailer.createTransport({
            service: 'Gmail',  
            auth: {
                user:process.env.Email_User,
                pass:process.env.Email_Pass         
            }
        });
        // datos del correo a enviar
        const mailOptions = {
            from:process.env.Email_User,
            to: email,
            subject: 'Verificación de la cuenta para usar asistente personal',
            text: `Debes  verificar tu cuenta con el siguiente código: ${verificationCode}`
          
        };

        // Enviar el correo de verificación
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error no se pudo enviar el correo de verificación vuelve a intentar"});
            } else {
                console.log('Correo enviado: ' + info.response);
                data.save();
                return res.status(200).json({ message: "Usuario creado. Revisa tu correo para verificar la cuenta." });
            }

        });
       
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario"/*, error: error.message*/ });
       // res.send(error);
        //next(error);
    }
}
exports.verifyuser = async (req, res, next) => {
    const { email, code } = req.body;

    try {
        const user = await DataUsers.findOne({ email: email })|| null;

        if (user === null) {
            return res.status(400).json({ message: "No se encontró el correo, prueba registrándote primero" });
        }

        if (user.status === "Verificado") {
            return res.status(400).json({ message: "El correo ya esta verificado" });
        }

        if (user.code === code) {
            user.status = "Verificado";
            await user.save();
            return res.status(200).json({ message: "Verificación exitosa" });
        } else {
            return res.status(400).json({ message: "Código de verificación incorrecto" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al verificar el usuario" });
    }
};


//actualizar usuario
exports.updateuser = async (req, res, next) => {
    try {
        const data = await DataUsers.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );
        if (!data) {
            return res.status(400).json({ message: "user not found" })
        }
        res.json({ message: "user updated", data: data });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
        next(error);
    }

};

//eliminar usuario
exports.deleteuser = async (req, res, next) => {
    try {
        const data = await DataUsers.findOneAndDelete(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );
        if (!data) {
            return res.status(400).json({ message: "user not found" })
        }
        res.json({ message: "user deleted", data: data });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
        next(error);
    }

};

//Eliminar usuarios

exports.deleteAllUsers = async (req, res, next) => {
    try {
        const data = await DataUsers.deleteMany({});
        if (!data) {
            return res.status(500).json({ message: "users not found" })
        }
        res.json({ message: "users deleted", data: data });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
        next(error);
    }
}


//This is for the token blacklist checking when the user logs out, so then we'll invalidate the past current token.
let blackListedTokens = [];

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await DataUsers.findOne({ email:
        email, password: password });
    
    const userStatus = 'Sin verificar';

    if (user) {
        // Check if the status is verified
        if (user.status === userStatus) {
            // Here is to deny the access to the user if the status is not verified, 
            //so then we'll send a message to the user, and redirect the user to a new page in our frontend.
            return res.status(400).json({ message: "El correo no ha sido verificado" });
        }
        const tokenPayload = { 
            code: user.code, // Example of including user ID
            idUser: user._id, // Catches the user ID generated by MongoDB
            name: user.name, // Include user name
            email: user.email // Include necessary information
        };
        const token = generateToken(tokenPayload);
        const tokenStored = new TokenSchema({
            token: token,
            userId: user._id,
        }); 
        user.activity = true; //El estado es true porque acaba de ingresar a la aplicación.
        await user.save();
        await tokenStored.save(); //Guardamos el token en la base de datos
        res.json({ 
            success: true,
            message: "Usuario logeado", 
            token: token,
            userId: user._id //para llamar el id del usuario
        });
    } else {
        res.status(400).json({ message: "Usuario no encontrado", success: false});
    }
};

//controladores para horarios

//buscar todos los horarios
exports.listshedules = async (req, res) => {
    try {
        const data = await DataSchedules.find({idUser: req.params.id}); // Get schedules filtering by user id
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(200).send(error);
    }
};

//añadir horario
exports.addschedule = async (req, res) => {
    const { name, description, day, hour, idUser } = req.body;

    const data = new DataSchedules({
        name: name || 0,
        description: description || 0,
        day: day || 0,
        hour: hour || 0,
        idUser: idUser || 0
    })

    try {
        await data.save();
        res.json({ message: "Added new message", data: data });
    } catch (error) {
        console.log(error);
        res.send(error);
        next();
    }
}

//actualizar horario
exports.updateschedule = async (req, res, next) => {
    try {
        const data = await DataSchedules.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );
        if (!data) {
            return res.status(400).json({ message: "Horario no encontrado" })
        }
        res.json({ message: "Horario Actualizado", data: data });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
        next(error);
    }

};

//eliminar horario
exports.deleteschedule = async (req, res, next) => {
    try {
        const data = await DataSchedules.findOneAndDelete(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );
        if (!data) {
            return res.status(400).json({ message: "Horario no encontrado" })
        }
        res.json({ message: "Horario Eliminado", data: data });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
        next(error);
    }

};

//CONTROLADORES PARA ACTIVIDADES

//agregar actividad
exports.addactivity = async (req, res, next) => {
    const { name, description, date, status, idUser } = req.body;

    const data = new DataActivity({
        name: name || '',
        description: description || '(Sin descripción)',
        date: date ? new Date(date) : new Date(),
        status: status || false,
        idUser: idUser || ''
    });

    try {
        const savedData = await data.save();
        res.status(201).json({ message: "Actividad añadida", data: savedData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al añadir la actividad", error: error.message });
        next();
    }
}

//eliminar actividad
exports.deleteactivity = async (req, res, next) => {
    try {
        const data = await DataActivity.findOneAndDelete(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );
        if (!data) {
            return res.status(400).json({ message: "Actividad no encontrada" })
        }
        res.json({ message: "Actividad Eliminada", data: data });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
        next(error);
    }

};

//actualizar actividad
exports.updateactivity = async (req, res, next) => {
    try {
        const data = await DataActivity.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );
        if (!data) {
            return res.status(400).json({ message: "Actividad no encontrada" });
        }
        res.json({ message: "Actividad actualizada", data: data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error", error: error.message });
        next(error);
    }
};

//ver todas las actividades
exports.listsactivity = async (req, res) => {
    try {
        const data = await DataActivity.find({idUser: req.params.id});
        res.json(data);
    } catch (error) {
        console.log('Error en el backend:', error);
        res.status(500).send(error);
    }
};


//NOTIFICACIONES

//enviar notificaciones(correo) de las actividades pendientes 
exports.notificacion = async(req, res)=>{

    const { email } = req.body;
    try {
        const user = await DataUsers.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }
       
         // Obtener las actividades pendientes (status: false)
         const pendingActivities = await DataActivity.find({ idUser: user._id, status: false });
         
            //configuración del correo
        const transporter = nodemailer.createTransport({
            service: 'Gmail',  
            auth: {
                user:process.env.Email_User,
                pass:process.env.Email_Pass         
            }
        });
         if (pendingActivities.length === 0) {
             //return res.status(200).json({ message: "No hay tareas pendientes." });
             const mailOptions = {
                from: process.env.Email_User,
                to: email,
                subject: 'No hay tareas pendientes',
                html: `
                    <h1>No hay tareas pendientes</h1>
                    <p>Felicidades actualmente no tienes ninguna tarea pendiente.</p>
                `
            };

            // Enviar el correo de notificación
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Error: no se pudo enviar el correo, vuelve a intentar" });
                } else {
                    console.log('Correo enviado: ' + info.response);
                    return res.status(200).json({ message: "Correo de notificación enviado." });
                }
            });
         }
         else{
     
         
         const activitiesList = pendingActivities.map(activity => `<li>${activity.name}: ${activity.description} - Fecha: ${activity.date.toDateString()}</li>`).join('');
         
        // datos del correo a enviar
        const mailOptions = {
            from:process.env.Email_User,
            to: email,
            subject: 'Lista de tareas pendientes',
       
            html: `
        <h1>Lista de tareas pendientes</h1>
        <p>Debes verificar tu cuenta con el siguiente código:</p>
        <ul>
             ${activitiesList}
        </ul>`
          
        };

        // Enviar el correo de notificaciones
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error no se pudo enviar el correo  vuelve a intentar"});
            } else {
                console.log('Correo enviado: ' + info.response);
              
                return res.status(200).json({ message: "Lista de tareas enviadas. Revisa tu correo para ver la lista de tareas pendientes." });
            }

        });
    }
       
    } catch (error) {
        res.status(500).json({ message: "Error al enviar la lista", error: error.message });
     

}}
