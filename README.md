//todo: readme

/***
	Breve descripción
***/
Este repositorio incluye una aplicación web para acceder al medidor de partículas y un programa independiente 	(mRegister) que recolecta y registra las mediciones en archivos.

Carpetas
	/***
		Contiene los archivos de las mediciones
	***/
	mediciones

	/***
		Contiene los modules de node.js instalado
	***/
	node_modules

	/***
		Contiene archivos con datos utilizados por la aplicación web y clientNet.js
	***/
	serverData
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

	***/
	requestHandlers.js
	



/***
	Programa que obtiene las mediciones y las registra en arvhivos csv
***/

mRegister.js




/***
	Temperatura
***/

/***
	Tiempo real
***/
Tomar las mediciones de las últimas 24 horas