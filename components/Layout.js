import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import web3 from '../ethereum/web3';
// import RenderLoading from './Loader';

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: undefined
        };
    }

    /**
     * checking if visitor is logged in to MetaMask
     */
    async componentDidMount() {
        const address = await web3.eth.getAccounts();
        this.setState({
            address: address !== undefined ? address[0] : null
        });
    }

    render() {
        return (
            <Container>
                <Head>
                    <title>StartupsOnTheBlockchain</title>
                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" type="text/css" />
                    <link rel="stylesheet" href="/static/styles/page.css" type="text/css" />
                </Head>
                <Header address={this.state.address} />
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {this.props.children}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Footer />
            </Container >
        );
    }
}

export default Layout;