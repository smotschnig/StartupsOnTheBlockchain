import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { Link } from '../routes';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

class StartupIndex extends Component {
    static async getInitialProps() {
        const projects = await factory.methods.getDeployedProjects().call();
        return {
            projects
        };
    }

    async getProjectTitle(address) {
        let title;
        try {
            title = await factory.methods.projectTitle(address).call();
        } catch (err) {
            console.log('err');
        }
        return title;
    }

    renderProjects() {
        const items = this.props.projects.map(address => {
            return {
                header: address,
                color: 'green',
                description: (
                    <Link route={`/projects/${address}`}>
                        <a>View Project</a>
                    </Link>
                ),
                meta: console.log('call ', this.getProjectTitle(address)),
                fluid: true,
                style: { overflowWrap: 'break-word' }
            };
        }, );
        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>Open Projects</h3>
                <Link route="projects/new">
                    <a>
                        <Button floated="right" content="Create Project" icon='add circle' primary />
                    </a>
                </Link>
                {this.renderProjects()}
            </Layout >
        );
    }
}

export default StartupIndex;