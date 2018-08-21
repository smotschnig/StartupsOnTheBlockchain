import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { Link } from '../routes';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

class StartupIndex extends Component {

    static async getInitialProps() {
        const addresses = await factory.methods.getDeployedProjects().call();
        let projects = [];

        for (let i = 0; i < addresses.length; i++) {
            projects.push({
                address: addresses[i],
                title: await factory.methods.projectTitle(addresses[i]).call()
            });
        }

        return {
            projects
        };
    }

    renderProjects() {
        const items = this.props.projects.slice(0).reverse().map(project => {
            return {
                meta: project.address,
                color: 'green',
                description: (
                    <Link route={`/projects/${project.address}`}>
                        <a>View Project</a>
                    </Link>
                ),
                header: project.title,
                fluid: true,
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>Open Projects</h3>
                {/* <Link route="projects/new">
                    <a>
                        <Button floated="right" content='New Project' icon='add circle' primary />
                    </a>
                </Link> */}
                {this.renderProjects()}
            </Layout >
        );
    }
}

export default StartupIndex;