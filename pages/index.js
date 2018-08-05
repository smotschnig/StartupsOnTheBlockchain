import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { Link } from '../routes';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';

class StartupIndex extends Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         data: {
    //             address: '',
    //             title: ''
    //         }
    //     };
    // }

    // componentDidMount() {
    //     const items = this.props.projects.slice(0).reverse().map(address => {
    //         this.getProjectTitle(address).then((title) => {
    //             this.setState({ data: { address, title } });
    //         });
    //     });
    // }

    static async getInitialProps() {
        const projects = await factory.methods.getDeployedProjects().call();
        return {
            projects
        };
    }

    // getProjectTitle(address) {
    //     return factory.methods.getDeployedProjects(address).call();
    // }

    // renderProjects() {
    //     const items = Object.entries(this.state.data).map(() => {
    //         return {
    //             meta: this.state.data.address,
    //             color: 'green',
    //             description: (
    //                 <Link route={`/projects/${this.state.data.address}`}>
    //                     <a>View Project</a>
    //                 </Link>
    //             ),
    //             header: factory.methods.projectTitle(address).call(),
    //             fluid: true,
    //             style: { overflowWrap: 'break-word' }
    //         };
    //     }, );
    //     return <Card.Group items={items} />
    // }

    renderProjects() {
        const items = this.props.projects.map(address => {
            return {
                header: address,
                meta: address,
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