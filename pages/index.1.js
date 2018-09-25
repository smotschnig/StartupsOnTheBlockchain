import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Card } from 'semantic-ui-react';
import { Link } from '../routes';
import moment from 'moment';
import _ from 'lodash';
import factory from '../ethereum/factory';
import Project from '../ethereum/project';
import web3 from '../ethereum/web3';

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
            const project = Project(addresses[i]);
            const summary = await project.methods.getSummary().call();
            console.log(summary[0]);
            projects.push({
                address: addresses[i],
                startup: summary[0],
                titleNew: summary[1],
                projects: await factory.methods.getProjects(addresses[i]).call()
            });
        }

        return {
            projects
        };
    }

    timeConverter(timestamp) {
        var date = moment.unix(timestamp);
        return date.format("DD.MM.YYYY - HH:mm");
    }

    renderProjects() {
        const items = this.props.projects.slice(0).reverse().map(project => {
            const { startup, title, date, wage } = project.projects;
            const { titleNew } = project;
            const { address } = project;
            return {
                key: address + date,
                header: titleNew,
                meta: startup + " " + web3.utils.fromWei(wage, 'ether') + " (ETH)",
                description: (
                    <Link route={`/projekt/${address}`}>
                        <a>Projekt ansehen</a>
                    </Link>
                ),
                extra: this.timeConverter(date),
                color: 'grey',
                fluid: true,
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>Offene Projekte</h3>
                {this.renderProjects()}
            </Layout >
        );
    }
}

export default StartupIndex;