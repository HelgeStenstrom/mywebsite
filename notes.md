# Anteckningar om att göra en websajt.

## Kunskapskällor

* [Routing and Navigation in Angular | Mosh](https://youtu.be/tUCa3JcFILI)
* ?

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

## Portar

* 80: webbens standardport
* 3000: backends port som en browser kan koppla sig till; gränssnitt mot 
  databasen SQL. Exponerad mot omvärlden.
* 3307: MariaDB port, som backend kommunicerar med. Ej exponerad mot omvärlden,
  förhoppningsvis.

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

Uppdatering 2022-11-08: Idag fungerar inte kommandot ovan.

    `[master] ~/Documents/GitHub/myGit/ts/mywebsite
    $ sudo ng serve --host 192.168.1.89 --host localhost --host 127.0.0.1 --host helges-mbp-2  --port 80
    Password:
    Error: This command is not available when running the Angular CLI outside a workspace.
    [master] ~/Documents/GitHub/myGit/ts/mywebsite`

Troligen för att jag är i fel folder när jag ger kommandot.



## Express
Jag kan serva Express till vilken port jag vill, med

    `app.listen(3000);`
    `app.listen(80);`

i server.js. Dock har jag ingen anledning att använda port 80; Express
används inte för frontend.

Det fungerar för flera olika sätt att skriva datorns adress:

* localhost
* 127.0.0.1
* 192.168.1.87
* helges-mbp-2

(ej testat för de senare, med port 80)

Koden servas med `nodemon server.js`.

sudo behöver inte användas.

### Start

* run configuration "mariastart"
  * Definieras i package.json som `"mariatart": "nodemon startMariaDb.js"`
  * startMariaDb.js definierar åtminstone några endpoints. Andra 
    hierarkiska nivåer, om det blir några, definieras kanske i andra filer. 

### Endpoints

* startMariaDb.js definierar åtminstone några endpoints. Andra
  hierarkiska nivåer, om det blir några, definieras kanske i andra filer.
* http://localhost:3000/
  * countries
  * members
  * wines
* Alla endpoints ger svar i JSON-form. Exakt format är inte dokumenterat.
* 

## SQL

### Docker

Startas med Docker Desktop

### MariaDB
user: root  
pw: root1234  

(Dessa måste ändras när det blir allvar med sajten.)

### Tabeller



## Externa API:n

### Systembolaget

Det verkar inte som om man kan få särskilt mycket användbar information från 
Systembolaget, sedan 1 november 2022. Har med deras policy att göra; inte 
främja konsumtion. 

Deras API finns kvar, men är det dokumenterat? 

| Användarnamn | h.stenstrom@gmail.com |
|--------------|----------------------|
| lösen        |                      |

Intressant nummer: 5cd7c7d6ed1c2b121ce45b91


#### Exempelkod Curl

`curl -v -X GET "https://api-extern.systembolaget.se/site/V2/Search/Site?q=omnipollo" -H "Ocp-Apim-Subscription-Key: {subscription key}" --data-ascii "{body}"`

`curl -v -X GET "https://api-extern.systembolaget.se/site/V2/Search/Site?q=omnipollo" -H "Ocp-Apim-Subscription-Key: 5cd7c7d6ed1c2b121ce45b91" --data-ascii "{body}"`

### Vinmonopolet

Username: h.stenstrom@gmail.com
Subscription key: 1ff26063efff409eb6200d72ac584c04



URL: http://api.vinmonopolet.no/

* [Learn about the API](http://api.vinmonopolet.no/docs/services?product=open)
* [Authorization Management](http://api.vinmonopolet.no/blog/authorization-management)


#### Examples

GET https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=10 HTTP/1.1

Cache-Control: no-cache
Ocp-Apim-Subscription-Key: 1ff26063efff409eb6200d72ac584c04



### Alko

Hela deras prislista finns som en Excel-fil som man kan ladda ner. Det finns 
ett eller ett par projet på GitHub, för att skapa ett API från dessa filer. 
Filen uppdateras dagligen.

## CORS-problemet

* https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
  * Beskriver problemet, och tre lösningar, där den föredragna är en lokal 
    proxy. Proxyn är en liten JS-funktion som använder Express, precis som 
    den som servar MariaDB backend nu.
  * Behöver jag en proxy per extern endpoint? Det verkar overkill!
  * Nej, det är inte värre än befintlig startMariaDb.js; en kort sektion per 
    endpoint, bara. I fallet startMariaDb.js, har jag en endpoint per tabell 
    i databasen. 
  * Det är förmodligen inte fullt så enkelt.
  * För Vinmonopolet måste rätt Headers och rätt URL överföras via proxyn 
    till vinmonopolet.no.
  * Värt att pröva proxyn på det enklare fallet Wikipedia.


## Provningar och omröstningar

### Provning

- Titel
- Längre beskrivning
- Var provningen hölls
- Vilka som deltog?

### Omröstning

- Vilka som deltog
- Hör till en provning
- Vinerna är definierade utanför komponenten, innan röstningen påbörjas
- Man vill kunna mata in röster, utan att vinerna avslöjas
- Vilka viner som deltog
- Varje röstares poäng för varje vin

#### Före omröstningen

- Lägg till viner
- Lägg till deltagare, eller numrera dem.

#### Under omröstningen

- Lägg till deltagarnas röstetal, ett i taget
- Uppdatera tabell och/eller graf allt eftersom

#### Efter omröstningen

- Visa tabell och graf
- Lås rösterna

## Roller

- Medlemmarna på sajten tilldelas roller.
- Roller kan vara tillfälliga
- Roller kan kopplas till en aktivitet, t.ex. en omröstning.
- Exempel
  - Rösträknare
    - Lägger in röstetal i tabellen under en omröstning
  - Omröstningsvärd
    - Lägger in viner till en omröstning
    - Lägger in deltagare i en omröstning
    - Är förmodligen ofta samma som rösträknaren.
  - Provningsvärd
    - Lägger in beskrivning och titel till en provning
  - Kalenderuppdaterare

## Kalender

Det kan vara önskvärt att ha en kalender i sajten. Men vi klarar oss nog bra 
utan.

- Egen lösning (verkar jobbigt)
- Integrera Google kalender
  - Kalenderdata sparas hos Google
- Någon färdig lösning för Angular (så länge vi använder Angular)
  - sparar kalenderdata i sajtens databas
- Datum för provningar
- Datum för resor
- Andra intressanta datum, t.ex. mässor, födelsedagar.
- 

## Unit testing med Jasmine/Karma

### Hitta GUI-element

```html
<button (click)="addWineToList()" data-test="add-wine-button" >
  Text på knapp
</button>
```
 
```typescript
const buttonElement = fixture.debugElement.query(  By.css('[data-test="add-wine-button"]'));
```


### Simulera klick på knapp
