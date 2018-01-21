# Servidor para el proyecto de Taller 1


## Requerimientos

1. node
2. npm
3. Instalar y correr el servicio de MongoDB  (https://www.digitalocean.com/community/tutorials/como-instalar-mongodb-en-ubuntu-16-04-es)

```sh

$ sudo apt install -y nodejs npm

```

## Instalación

```sh

$ npm install # en la carpeta del proyecto

```

## Levantar

```sh

$ npm start # en la carpeta del proyecto

```

## Testear

```sh

$ node mock/client.js <Nombre del dispositivo> # con el servidor corriendo

```


# API

La API está documentada en http://localhost/

# POST /dispositivos 

Registra un dispositivo al servidor. Si después se hace un GET /dispositivos se listan los dispositivos creados

Recibe un request con el siguiente JSON en el cuerpo. Ip debe ser única

```

{
  "ip": "192.168.0.11",
  "nombre": "Nombre de prueba",
  "sample_rate": 44000
}

```

Response con el puerto al cual enviar los paquetes UDP

```

8081

```

A partir de este momento cualquier paquete UDP que se mande al servidor va a aparecer en la consola 

# DELETE /dispositivos

Da de baja un dispositivo  

Recibe un request con el puerto al cual se estaba transmitiendo

```

8081

```


# UDP

Si solamente interesa probar la llegada de paquetes UDP 

```

$ node mock/receive-udp.js

```

Abre un servidor UDP en puerto 8080 y muestra en consola lo que llega como arreglo de bytes