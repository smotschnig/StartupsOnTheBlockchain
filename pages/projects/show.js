import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Project from '../../ethereum/project';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

class ProjectShow extends Component {
    render() {
        return (
            <Layout>
                <h1>
                    Show.js
                </h1>
            </Layout>
        );
    }
}

export default ProjectShow;