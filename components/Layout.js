import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default (props) => {
    return (
        <Container>
            <Head>
                <title>StartupsOnTheBlockchain</title>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" type="text/css" />
                <link rel="stylesheet" href="/static/styles/page.css" type="text/css" />
            </Head>
            <Header />
            {props.children}
            <Footer />
        </Container>
    );
};