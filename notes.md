# Anteckningar om att göra en websajt.

## Sajtens delar

* databas: lagrar sådant vi vill spara mellan sessioner
  * MariaDB/MySQL
  * MongoDB
* backend
  * Sköter det som inte direkt är användargränssnitt. 
  * Har sin egen port och "server"
  * kommunicerar med databas och frontend
  * Troligen med Express
* frontend
  * Användargränssnitt
  * Inloggning
  * https
  * Troligen med Angular
* Docker
  * Jag tror Docker kan vara ett praktiskt sätt att få sajtens funktioner 
    uppdelade i mindre bitar.
  * Gör det lättare att flytta sajten mellan olika datorer, t.e.x. Laptop, 
    Mac-Mini, Amazon AWS.
  * Olika "containers" för olika delar; databas, backend, frontend. 

## Express
Jag kan serva Express till vilken port jag vill, med

    `app.listen(3000);`
    `app.listen(80);`

i server.js

Det fungerar för flera olika sätt att skriva datorns adress:

* localhost
* 127.0.0.1
* 192.168.1.87
* helges-mbp-2

(ej testat för de senare, med port 80)

Koden servas med `nodemon server.js`.

sudo behöver inte användas.


## Angular

Default port är 4200. Sidan servas från ett terminalfönster i
`~/Documents/GitHub/myGit/ts/mywebsite/hartappat`
med kommandot `ng serve`.

### Andra hosts än localhost
`ng serve --port 4205` servar till `http://localhost:4205/`, men inte
till andra sätt att skriva adressen, t.ex. `http://127.0.0.1:4205/`.

För IP-adress krävs
`ng serve --host 192.168.1.89 --port 4205`

eller egentligen bara  sudo `ng serve --host 192.168.1.89`


För åtkomst

### Port 80


För port 80 krävs sudo.

`sudo ng serve --host 192.168.1.89 --host localhost --host 127.0.0.1 --host helges-mbp-2  --port 80`

Med detta kommando kommer jag åt Angular, körandes på min Mac, från min iPhone, ansluten till samma lokala nätverk.


