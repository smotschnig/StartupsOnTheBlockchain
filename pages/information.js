import React, { Component } from 'react';
import Layout from '../components/Layout';

class Information extends Component {
    render() {
        return (
            <Layout>
                <h3>Informationen</h3>
                <p>
                    Die Webplattform ist optimiert für eine <b>1920x1080</b> (FullHD) Auflösung. Eine Mobile-Version wird momentan nicht angeboten.
                    Um die Webplattform vollständig nutzen zu könnnen wird entweder <b>MetaMask</b> (Chrome Extension) oder <b>Cipher</b> (Browser) benötigt.
                    <i> Empfehlung: MetaMask</i>. Die entsprechenden Transaktionen finden im Ethereum <b>Rinkeby Test Net</b> statt und sind somit kostenlos. <br /><br />
                    <a target="_blank" href="https://medium.com/@judithESSS/loslegen-mit-ethereum-teil-2-metamask-installieren-einrichten-und-benutzen-b9a5025072"> Hier </a>
                    ist eine deutsche Anleitung zur Einrichtung und Nutzung von MetaMask. <br />
                    <a target="_blank" href="https://faucet.rinkeby.io/"> Hier</a> gibt es kostenlos ETH (wird für einzelne Transaktionen z.B. als Gebühr benötigt).
                </p>

                <h5>Vorgehenweise</h5>
                <ol>
                    <li>Logge dich bei MetaMask ein (Chrome Extensions) - <b>WICHTIG: Rinkeby Testnetzwerk auswählen!</b></li>
                    <li>Aktualisiere ggf. die Seite</li>
                    <li>Wähle in der Navigation "Profil" aus und erstelle ein neues Profil (Änderungen können dort nachträglich durchgeführt werden)</li>
                    <li>Startup</li>
                    <ul>
                        <li>Um ein neues Projekt anzulegen, wähle in der Navigation "Neues Projekt" aus</li>
                        <li>Nachdem du die benötigten Eingaben getätigt und einen neuen Smart Contract erstellt hast, wird das Projekt auf der Startseite aufgelistet</li>
                        <li><i>noch offen:</i> Nach Klick auf "Projekt ansehen", kannst du die Projektdetails einsehen - mit Klick auf "Bewerberpool", kannst du einen Freelancer aus dem Pool für das Projekt auswählen</li>
                    </ul>
                    <li>Freelancer</li>
                    <ul>
                        <li>Suche dir ein passendes Projekt auf der Startseite aus und betrachte die Details durch ein Klick auf "Projekt ansehen"</li>
                        <li>Mit Klick auf "Bewerbung einreichen", kannst du dich nach der Eingabe weiterer Details, für das Projekt bewerben und deine Bewerbung versenden</li>
                    </ul>
                </ol>

                <h5>Verwendete Techniken</h5>
                <ul>
                    <li>HTML/CSS</li>
                    <li>JavaScript</li>
                    <li>ReactJS</li>
                    <li>Semantic UI React</li>
                    <li>NextJS</li>
                    <li>Solidity</li>
                    <li>Web3</li>
                    <li>Ganache</li>
                </ul>
            </Layout >
        );
    }
}

export default Information;