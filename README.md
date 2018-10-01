# StartupsOnTheBlockchain
a blockchain-based startup webplatform

---

#### Demo (Live-Preview - 30/09/2018)
<https://startupsontheblockchain-spongvrwko.now.sh/>

*Forwarding:*
<http://sven.motschnig.de/>

Note: First start needs a little time, App is sleeping when unused.

---

#### How to get started?

* Clone Repository: __`git clone https://github.com/smotschnig/StartupsOnTheBlockchain.git`__
* Open folder: __`cd StartupsOnTheBlockchain`__
* Run: __`npm install`__
* Build: __`npm run build`__
* Start Server by: __`npm run start`__

If you are on a Unix-System you have to change one line in package.json file.
* Change: __`"start": "SET NODE_ENV=production && node server.js"`__ to: __`"start": "NODE_ENV=production node server.js"`__

After that you can visit the webplatform at __`http://localhost:3000`__ or you may change the port in the __`server.js`__ file.
You have to install MetaMask connected with a Rinkeby-Account to use the webplatform correctly. 

#### How to compile and deploy an own contract?

* Move to folder ethereum: __`cd ethereum`__
* Compile contract: __`node compile.js`__
* Deploy contract: __`node deploy.js`__
* Copy __`Contract depolyed to 0x000000`__ address to the clipboard

* Open the config folder in the root directory: __`cd config`__
* Open following file in this directory: __`address.js`__
* Update address in second line: __`module.exports = { address: '0x000000' (address from clipboard)};`__
  
If there are problems with npm install on Windows, you have to install additional dependencies globally.
* Run: __`npm install --global --production windows-build-tools`__
* Run: __`npm install --global node-gyp`__

---

#### ToDo-List:

##### *must-have*:
* ~~Als Startup: Freelancer auswählen, Bewerberpool anpassen mit "Wähle Bewerber aus"~~
* ~~Wenn Projekt fertig: finalizeProjectAsFreelancer und finalizeProjectAsStartup (+ Wage-Transfer (noch nicht im Back-End)) im Front-End implementieren~~
* ~~Möglichkeit bieten, Projekt zu melden (Schlechtleistung, keine Rückmeldungen, etc., gemeldetes Projekt markieren)~~
* ~~Abgeschlossene Projekte markieren (entweder ausblenden oder seperate Liste)~~
* ~~Bewertungssystem im Front-End implementieren und Durchschnitt berechnen (mit Sternbewertung darstellen)~~
* ~~Zurück-Button anpassen beim Betrachten des Manager-Profils im jeweiligen Projekt (Problem: Prop funktioniert bei next-routes nicht, daher wird Profil-Adresse übergeben, nicht aber Projekt-Adresse (Mapping nicht möglich, wenn Startup mehrere Projekte erstellt hat))~~
* ~~Code kommentieren~~

##### *should-have*:
* Loader während Rendering erstellen (Seite im Hintergrund erst vollständig laden und erst anschließend anzeigen)
* Wenn Freelancer von Startup ausgewählt, Kommunikationsplattform bieten und Projekt nicht als offen auf Startseite anzeigen
* Pop-Ups bzw. Benachrichtigungen an jeweiligen Benutzer (z.B. Nachricht an Freelancer, wenn dieser für Projekt ausgewählt worden ist)
* Sicherheitsaspekte: teilweise Validationen nur im Front-End, könnten u. U. ausgehebelt werden
* Geschwindigkeit optimieren

##### *could-have*:
* Front-End anpassen, Semantic UI React optimieren -> Design-Optimierung
* CSS anders einbinden, Next.js ist da etwas speziell
* "Code aufräumen", Wiederholungen in Components packen
* Gas-Limit der Smart Contracts minimieren
* Pagination implementieren, um u.a. Anzahl der angezeigten Projekte zu limitieren
* Ausbildungsinformationen und Erfahrungen bei Profilansicht formatieren (Zeilenumbruch)
* Bei nicht allen Seiten ist ein Aktualisiern der Seite (F5) im Browser möglich -> 404 Fehler
* Console-Ausgabe deaktivieren, Webpack listet durchgehend Informationen
* verschiedene Validationen: z.B. E-Mail-Überprüfung
* Dropdowns und sonstige Vorlagen für Forms erstellen
* Link-Zurück über "Offene Projekte" optimieren, bisher landet man auf Landing Page
