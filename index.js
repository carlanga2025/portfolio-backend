import express from 'express';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import cors from 'cors';

const port = 3000;
const app = express();
app.use(cors());

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Puedes usar otro servicio
  auth: {
    user: process.env.GMAIL_USER, // Tu correo
    pass: process.env.GMAIL_PASS, // Tu contraseña o una contraseña de aplicación
  },
  debug: true,
});
// Ruta para enviar el correo
app.post('/enviar-correo', (req, res) => {
  const { name, email, message } = req.body;

  console.log(name, email, message);

  if (!name || !email || !message) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: 'Nuevo mensaje de contacto',
    text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error); // Imprime el error en la consola
      return res.status(500).send('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
    }
    console.log('Correo enviado:', info.response);

    res.status(200).send('¡Mensaje enviado con éxito!');
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});