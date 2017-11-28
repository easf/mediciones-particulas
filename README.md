//Readme
Repo: https://github.com/easf/mediciones-particulas.git
/***
	Breve descripción
***/
Este repositorio incluye una aplicación web para acceder al medidor de partículas, un programa independiente 	(mRegister) que recolecta y registra las mediciones en archivos y una aplicación web (realTime/	realtime.js) para mostrar en tiempo real (actualización cada 5 minutos) el índice de calidad del aire de PM2.5.

Carpetas
	/***
		Contiene los módulos de node.js instalado de la aplicación web para acceder al medidor de particulas
	***/
	node_modules

	/***
		Contiene imagenes, logos
	***/
	Public

	/***
		Contiene los archivos de las mediciones, su propias dependencias en realTime/node_modules, los archivos html en realTime/views, el archivo realtime.js que sirve el indice de la calidad del aire en tiempo real, los archivos realTime/apiKey y realTime/factors que almacenan el api key para Google Maps y los factores de corrección para el cálculo del índice de calidad del aire cuyos valores originales son "0.38,25", el archivo realTime/package.json describe datos y dependencias de realtime.js
	***/
	realTime



	/***
		Contiene archivos con datos utilizados por la aplicación web y mRegister.js. El archivo serverData/key 	almacena la clave de acceso, serverData/lastElapsedTime	almacena el último elapsed time enviado por el medidor en segundos y registrado por mRegister.js, serverData/startDateTime almacena la fecha y hora de inicio del servidor en milisegundos
	***/
	serverData
	
	
	
	/***
		Contiene los archivos html
	***/
	views


/***
	Archivo que contiene las dependencias de la aplicación web y del programa que obtiene las mediciones
***/
package.json


/***
	Archivos de la aplicación web
****/

	/***
		Configuración de puerto e ip
	****/
	config.js

	/***
		Archivo main
	***/
	index.js

	/***
		Construcción y configuración del servidor
	***/
	server.js

	/***
		Mapeo de rutas y funciones atendedoras de consultas
	***/
	router.js

	/***
		Funciones que atienden las consultas sobre las rutas 
	***/
	requestHandlers.js
	



/***
	Programa que obtiene las mediciones y las registra en arvhivos csv
***/

mRegister.js

/***
	Para una nueva instalación, después de clonar el repositorio, instalar las dependencias con npm: npm install dentro de la carpeta principal y luego dentro de realTime, y crear los siguientes archivos:
		serverData/key
		serverData/lastElapsedTime
		serverData/startDateTime

		realTime/apiKey
		realTime/factors

	Y un archivo: 
		mediciones/mediciones-<año anterior>.csv // este archivo debe contener 289 filas con las siguientes columnas:
			fecha, hora, tiempo transcurrido, medicion
		Todos los valores de la columna medición de dicho archivo deben ser 0.0

	Tip: Verficar que los archivos creados tengan los permisos correctos de lectura y escritura
	Obs: Si se instalan nuevas dependencias usar el siguiente comando:
	npm install <nombre de la dependencia> --save  // el --save actualiza el package.json:

***/


