import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class ProjectNew extends Component {
    render() {
        return (
            <Layout>
                <h1>
                    New.js
                </h1>
            </Layout>
        );
    }
}

export default ProjectNew;