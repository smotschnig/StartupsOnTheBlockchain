import React, { Component } from 'react';
import Layout from '../components/Layout';

class Information extends Component {
    render() {
        return (
            <Layout>
                <h3>Information</h3>
                <p>
                    Die Webplattform ist optimiert für eine <b>1920x1080</b> (FullHD) Auflösung. Eine Mobile-Version wird momentan nicht angeboten.
                    Um die Webplattform vollständig nutzen zu könnnen wird entweder <b>MetaMask</b> (Chrome Extension) oder <b>Cipher</b> (Browser) benötigt.
                    <i> Empfehlung: MetaMask</i>. Die entsprechenden Transaktionen finden im Ethereum <b>Rinkeby Test Net</b> statt und sind somit kostenlos. <br /><br />
                    <a target="_blank" href="https://medium.com/@judithESSS/loslegen-mit-ethereum-teil-2-metamask-installieren-einrichten-und-benutzen-b9a5025072"> Hier </a>
                    ist eine deutsche Anleitung zur Einrichtung und Nutzung von MetaMask. <br />
                    <a target="_blank" href="https://faucet.rinkeby.io/"> Hier</a> gibt es kostenlos ETH (wird für einzelne Transaktionen z.B. als Gebühr benötigt).
                </p>

                <h5>Verwendete Techniken</h5>
                <ul>
                    <li>HTML/CSS</li>
                    <li>JavaScript</li>
                    <li>ReactJS</li>
                    <li>Semantic UI React</li>
                    <li>NextJS</li>
                    <li>ExpressJS</li>
                    <li>Solidity</li>
                    <li>Web3</li>
                    <li>Ganache</li>
                </ul>
            </Layout >
        );
    }
}

export default Information;