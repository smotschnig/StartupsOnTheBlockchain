import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

class Layout extends Component {
    render() {
        return (
            <Container>
                <Head>
                    <title>StartupsOnTheBlockchain {this.props.address}</title>
                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" type="text/css" />
                    <link rel="stylesheet" href="/static/styles/page.css" type="text/css" />
                </Head>
                <Header />
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