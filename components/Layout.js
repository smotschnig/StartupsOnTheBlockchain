import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import RenderLoading from './Loader';

import web3 from '../ethereum/web3';

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: undefined,
            isLoading: true
        };
    }

    async componentDidMount() {
        const address = await web3.eth.getAccounts();
        this.setState({
            address: address !== undefined ? address[0] : null,
            isLoading: false
        });
    }

    showContent = () => {
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

    render() {
        return (
            <div>
                {this.state.isLoading ? <RenderLoading /> : this.showContent()}
            </div>
        );
    }
}

export default Layout;