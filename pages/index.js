import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Card } from 'semantic-ui-react';
import { Link } from '../routes';
import moment from 'moment';
import _ from 'lodash';
import factory from '../ethereum/factory';

class StartupIndex extends Component {
    static async getInitialProps() {
        const addresses = await factory.methods.getDeployedProjects().call();
        let projects = [];

        // Iteration über alle addresses
        // getProjects returns (string, string, uint, uint)
        // z.B.
        // 0: string: Startup300 // Name des Startups
        // 1: string: Webdeveloper (m/w) // Title der Berufsbezeichnung
        // 2: uint: 1312312 // Deadline als Integer
        // 3: uint: 1231233 // Date als Integer (Erstelldatum des Contracts)
        for (let i = 0; i < addresses.length; i++) {
            projects.push({
                address: addresses[i],
                projects: await factory.methods.getProjects(addresses[i]).call()
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
        const items = this.props.projects.slice(0).reverse().map(p => {
            const { startup, title, date } = p.projects;
            const { address } = p;
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
    }

    render() {
        return (
            <Layout>
                <h3>Open Projects</h3>
                {this.renderProjects()}
            </Layout >
        );
    }
}

export default StartupIndex;