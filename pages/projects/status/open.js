import React, { Component } from 'react'
import Layout from '../../../components/Layout';
import { Card } from 'semantic-ui-react';
import { Link } from '../../../routes';
import web3 from '../../../ethereum/web3';
import moment from 'moment';
import Project from '../../../ethereum/project';
import factory from '../../../ethereum/factory';

class OpenProjects extends Component {
    static async getInitialProps() {
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);

        const addresses = await factory.methods.getDeployedProjects().call();
        console.log(addresses);

        let openStartupProjects = [];

        for (let i = 0; i < addresses.length; i++) {
            const manager = await factory.methods.getProjects(addresses[i]).call();
            if (accounts[0] === manager.manager) {
                const project = Project(addresses[i]);
                const sum = await project.methods.getSummary().call();

                if (!sum[5]) {
                    openStartupProjects.push({
                        address: addresses[i],
                        projects: await factory.methods.getProjects(addresses[i]).call()
                    });
                }
            }
        }

        let openFreelancerProjects = [];

        for (let i = 0; i < addresses.length; i++) {
            const manager = await factory.methods.getProjects(addresses[i]).call();
            console.log(manager);
            const project = Project(addresses[i]);
            console.log(project);

            try {
                const chosenFreelancer = await project.methods.getApplicantInfo(accounts[0]).call();
                if (chosenFreelancer[2])
                    openFreelancerProjects.push({
                        address: addresses[i],
                        projects: await factory.methods.getProjects(addresses[i]).call()
                    });
            } catch (err) {
                console.log(err);
            }
        }

        return {
            openStartupProjects,
            openFreelancerProjects
        };
    }

    timeConverter(timestamp) {
        var date = moment.unix(timestamp);
        return date.format("DD.MM.YYYY - HH:mm");
    }

    renderOpenStartupProjects() {
        const items = this.props.openStartupProjects.slice(0).reverse().map(project => {
            const { startup, title, date, wage } = project.projects;
            const { address } = project;
            return {
                key: address + date,
                header: title,
                meta: startup + " " + web3.utils.fromWei(wage, 'ether') + " (ETH)",
                description: (
                    <Link route={`/projekt/${address}`}>
                        <a>Projekt ansehen</a>
                    </Link>
                ),
                extra: this.timeConverter(date),
                color: 'green',
                fluid: true,
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={items} />
    }

    renderOpenFreelancerProjects() {
        const items = this.props.openFreelancerProjects.slice(0).reverse().map(project => {
            const { startup, title, date, wage } = project.projects;
            const { address } = project;
            return {
                key: address + date,
                header: title,
                meta: startup + " " + web3.utils.fromWei(wage, 'ether') + " (ETH)",
                description: (
                    <Link route={`/projekt/${address}`}>
                        <a>Projekt ansehen</a>
                    </Link>
                ),
                extra: this.timeConverter(date),
                color: 'blue',
                fluid: true,
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                {this.renderOpenStartupProjects()}
                {this.renderOpenFreelancerProjects()}
            </Layout>
        );
    }
}

export default OpenProjects;
