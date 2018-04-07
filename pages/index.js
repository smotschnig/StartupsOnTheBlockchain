import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { Link } from '../routes';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import Cards from '../components/Cards';


class StartUp extends Component {

    static async getInitialProps() {
        const projects = await factory.methods.getDeployedProjects().call();
        return { projects };
    }

    renderProjects() {
        const items = this.props.projects.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/projects/${address}`}>
                        <a>View Project</a>
                    </Link>
                ),
                fluid: true,
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={items} />
    }

    renderTestProjects() {

    }

    render() {
        return (
            <Layout>
                <h3>Open Projects</h3>
                <Grid>
                    <Grid.Column width={12}>
                        <Cards />
                        {this.renderProjects()}
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Link route="projects/new">
                            <a>
                                <Button primary floated="right" content="Create Project" icon='add circle' />
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default StartUp;