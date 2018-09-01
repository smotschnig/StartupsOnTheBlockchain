import React, { Component } from 'react';
import { Grid, Menu, Icon } from 'semantic-ui-react';
import { Link } from '../routes';

// import web3 from '../ethereum/web3';

export default () => {

    // const accounts = await web3.eth.getAccounts();
    // const address = accounts[0];

    // sofern Benutzer MetaMask verwendet und eingeloggt ist, hat dieser eine Adresse !== undefined.

    // if (address !== undefined) {
    //  showButtons New Project & Profile
    //  speichere Adresse in state oder sonst wo für Link
    // } else {
    //  showButtons=false   
    // }

    // eventuell mit ComponentDidMount oder getInitialState oder sowas
    // vielleicht auch schon vorher in Layout.js festlegen und dann als Prop weiterleiten?

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Menu className="Header">
                        <Link route="/"><a className="item"><Icon name="chain" />StartupsOnTheBlockchain</a></Link>
                        <Menu.Menu position="right">
                            {/* {showButtons ? <Link route="/projects/new"><a className="item"><Icon name="plus circle" />New Project</a></Link> : null} */}
                            <Link route="/projects/new"><a className="item"><Icon name="plus circle" />New Project</a></Link>
                            <Link route="/information"><a className="item"><Icon name="info circle" />Information</a></Link>
                            <Link route="/profile"><a className="item"><Icon name="user circle" />Profile</a></Link>
                            {/* {showButtons ? <Link route={`/profile/${address}`}><a className="item"><Icon name="user circle" />Profile</a></Link> : null} */}
                        </Menu.Menu>
                    </Menu>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}
