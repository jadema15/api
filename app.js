const express = require('express');
const mysqldump = require('mysqldump');
const fs = require('fs');
const app = express();
const puerto =  process.env.PORT || 3000;

app.get('/backup', async (req, res) => {
    try {
        // Obtener la fecha y hora actual
        const fechaHoraActual = new Date();
        
        // Formatear la fecha y hora como parte del nombre del archivo
        const nombreArchivo = `Backup_${fechaHoraActual.getFullYear()}-${pad(fechaHoraActual.getMonth() + 1)}-${pad(fechaHoraActual.getDate())} Hora ${pad(fechaHoraActual.getHours())} ${pad(fechaHoraActual.getMinutes())} ${pad(fechaHoraActual.getSeconds())}.sql`;
        
        // Ruta completa del archivo
        const rutaArchivo = `./backup/${nombreArchivo}`;

        // Verificar si el archivo ya existe
        if (fs.existsSync(rutaArchivo)) {
            res.status(409).send('El archivo ya existe. Cambie el nombre del archivo o elimínelo antes de realizar un nuevo respaldo.');
            return;
        }

        // Realizar el respaldo a un archivo con el nombre formateado
        await mysqldump({
            connection: {
                host: 'sql941.main-hosting.eu',
                user: 'u372482362_develop',
                password: '%oU$Zt9;3U^F',
                database: 'u372482362_bddevelop',
                port: 3306,
            },
            dumpToFile: rutaArchivo,
        });

        res.send(`¡Hola, mundo! Respaldo completado en ${rutaArchivo}`);
    } catch (error) {
        console.error('Error al realizar el respaldo:', error);
        res.status(500).send('Error al realizar el respaldo.', error);
    }
});

app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

