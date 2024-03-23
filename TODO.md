# Saker att göra

- Få bort loggat fel då druva tas bort
- Lista av druvor ska uppdateras direkt när druva tas bort.
- Gör uppdateringen tillförlitlig; nu fungerar den bara "oftast".
- Lista av druvor ska uppdateras direkt när druva läggs till
- Sluta använda endpoint /g2
- Redigera druva
  - endpoint
  - anrop från komponent
- ======= klart hit ==========
- Skriv API-beskrivning `hartappat.yaml`.
  - POST wines
  - Förstå hur parametrar skrivs som body eller som URL-värden
- Få bort loggat fel då koden uppdateras
  - Gissningsvis relaterat till saker som inte utförs i förväntad ordning
- https
  - När sajten är sjösatt, vill man definitivt ha https, och inte http. 
    Under utvecklingsarbetet kan det duga med http.
- Login/autentisering
  - Nödvändigt för en sjösatt sajt.
- Tabell för användare
  - username
  - hashed salted password
    - bara om ingen extern service används.
  - logged in or not?
  - för- och efternamn
  - annat intressant?
  - Förmodligen bör tabellen hållas liten. Information som inte behövs för 
    autentisering ska finnas i andra tabeller.
- Service för lagring av bilder och andra stora filer
- installera och testa bcrypt
- autentisering
  - Lär mig om JWT, Json Web Tokens
  - undersök BankID
  - Logga in med Google?
  - Logga in med Facebook?
- GUI: vin
  - lägga till
  - redigera
- Backend
  - Krascha inte om databasen är nere
- Gemensamma typdefinitioner för frontend och backend. Åtminstone om det 
  hjälper.
  - Gör en tabell som beskriver typerna som finns både i frontend och i 
    databasen, och beskriv skillnader och kopplingar. T.ex. kanske två 
    tabeller länkar till varandra, och exempelvis en tabell har ett ID från 
    en annan tabell, istället för ett textvärde.
  - Beskriv skillnader i namngivning av vissa fält, t.ex. category vs winetype.
- Lägga till ett vin
  - Bestäm om http query ska skicka texter eller ID för country, winetype 
    och andra Foreign Keys.
    - Eller bestäm mig för att implementera bägge varianterna.
    - Googla på vad som är _best practice_.
  - Om jag skickar ID (foreign key)
    - Frontend måste ha värdena på de foreign keys som ska användas.
    - Användaren måste få listor på tillåtna textvärden för Country och 
      Winetype (category)
    - Frontend måste veta ID-värdena för dessa textvärden.
    - Det måste finnas ett sätt att skapa ett nytt land eller en ny vintyp, 
      i GUI. (Åtminstone ett nytt land)
  - Om jag skickar textvärden
    - Frontend måste ha värdena för länder och winetypes som redan finns.
    - Backend ansvarar för att omvandla textvärden till foreign keys.
    - Om värdena inte redan finns, läggs de till i respektive tabell.
  - Gemensamt i bägge fallen
    - Vi måste kunna ta bort länder och vintyper som inte används.
    - Det kan möjligen ske automatiskt, utan inblandning av GUI, baserat på 
      lämpliga kriterier.
  - Fundera på "referential integrity" i databasen. Om ett vin  kommer från 
    landet 17, måste det finnas garantier för att landet 17 (Grekland?) finns 
    i en tabell i databasen. Man ska inte kunna ta bort Grekland, om något vin 
    därifrån finns i databasen.
    - Förmodligen kan Sequelize hjälpa till med detta. 
- TDD: backend
  - Ett land kan läggas till databasen
  - Länder kan läsas från databasen
  - Vintyper kan skrivas och läsas från databasen
  - Ett vin kan skrivas, med land och vintyp som text. Om land och vintyp 
    inte fanns i förväg, finns de efter att vinet skrivits.


# Gemensamma typer

## Wine

- tabell `wines`
  - har ID
  - länkar countries, winetypes
    - country länkar till countries
    - winetype länkar till winetypes
- 
