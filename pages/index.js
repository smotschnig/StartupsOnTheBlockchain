import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { Link } from '../routes';
import factory from '../ethereum/factory';
import Project from '../ethereum/project';
import Layout from '../components/Layout';
import moment from 'moment';
import _ from 'lodash';

class StartupIndex extends Component {
    static async getInitialProps() {
        const addresses = await factory.methods.getDeployedProjects().call();
        let projects = [];

        for (let i = 0; i < addresses.length; i++) {
            projects.push({
                address: addresses[i],
                title: await factory.methods.projectTitle(addresses[i]).call(),
                date: await factory.methods.projectDate(addresses[i]).call(),
                startup: await factory.methods.projectStartup(addresses[i]).call()
            });
        }

        return {
            projects
        };
    }

    timeConverter(timestamp) {
        var date = moment.unix(timestamp);
        return date.format("DD.MM.YYYY - HH:mm:ss");
    }

    renderProjects() {
        var key;
        const items = this.props.projects.slice(0).reverse().map(project => {
            const { title, address, date, startup } = project;
            key = address;
            return {
                header: title,
                meta: startup,
                description: (
                    <Link route={`/projects/${address}`}>
                        <a>View Project</a>
                    </Link>
                ),
                extra: this.timeConverter(date),
                color: 'green',
                fluid: true,
                style: { overflowWrap: 'break-word' },
                key: address
            };
        });
        return <Card.Group key={key} items={items} />

        // ALTERNATIVE: GLEICHES ERGEBNIS
        // return (this.props.projects.slice(0).reverse().map((project) => (
        //     <Card.Group key={project.address}>
        //         <Card
        //             header={project.title}
        //             meta={project.startup + "" + project.rating}
        //             description={(
        //                 <Link route={`/projects/${project.address}`}>
        //                     <a>View Project</a>
        //                 </Link>
        //             )}
        //             extra={this.timeConverter(project.date)}
        //             fluid
        //             color='green'
        //         />
        //     </Card.Group>
        // )));
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