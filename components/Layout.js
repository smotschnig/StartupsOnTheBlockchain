import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default (props) => {
    return (
        <Container>
            <Head>
                <link href="/static/semantic.min.css" rel="stylesheet"></link>
            </Head>
            <Header />
            {props.children}
            <Footer />
        </Container>
    );
};