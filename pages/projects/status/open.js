import React, { Component } from 'react'
import Layout from '../../../components/Layout';
import { Card } from 'semantic-ui-react';
import { Link, Menu } from '../../../routes';
import web3 from '../../../ethereum/web3';
import moment from 'moment';
import Project from '../../../ethereum/project';
import factory from '../../../ethereum/factory';

class OpenProjects extends Component {
    static async getInitialProps() {
        const accounts = await web3.eth.getAccounts();
        const addresses = await factory.methods.getDeployedProjects().call();

        let openStartupProjects = [];

        for (let i = 0; i < addresses.length; i++) {
            const manager = await factory.methods.getProjects(addresses[i]).call();
            if (accounts[0] === manager.manager) {
                const project = Project(addresses[i]);
                const summmary = await project.methods.getSummary().call();

                if (!summmary[5]) {
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
            const project = Project(addresses[i]);


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

        let projectsUnderInvestigation = [];

        for (let i = 0; i < addresses.length; i++) {
            const manager = await factory.methods.getProjects(addresses[i]).call();
            const project = Project(addresses[i]);

            try {
                const chosenFreelancer = await project.methods.getApplicantInfo(accounts[0]).call();
                console.log("cf", chosenFreelancer);
                const underInvestigation = await project.methods.getSummary().call();
                console.log("ui", underInvestigation);

                if (accounts[0] === manager.manager || chosenFreelancer[2]) {
                    if (underInvestigation[9])
                        projectsUnderInvestigation.push({
                            address: addresses[i],
                            projects: await factory.methods.getProjects(addresses[i]).call()
                        });
                }
            } catch (err) {
                console.log(err);
            }
        }

        return {
            openStartupProjects,
            openFreelancerProjects,
            projectsUnderInvestigation
        };
    }

    timeConverter(timestamp) {
        var date = moment.unix(timestamp);
        return date.format("DD.MM.YYYY - HH:mm");
    }

    callInvestigator = async (address) => {
        const project = Project(address);
        const accounts = await web3.eth.getAccounts();

        await project.methods.callInvestigator().send({
            from: accounts[0]
        });
    };

    cancelProject = async (address) => {
        const project = Project(address);
        const accounts = await web3.eth.getAccounts();

        await project.methods.cancelProject().send({
            from: accounts[0]
        });
    };

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
                extra:
                    <div className='ui three buttons'>
                        <button className='ui green basic button' role='button'>
                            <Link route={`/projekte/offen/${address}/beenden`}>
                                <a>Projekt abschließen</a>
                            </Link>
                        </button>
                        <button className='ui yellow basic button' role='button' onClick={() => this.callInvestigator(address)}>
                            Projekt melden
                        </button>
                        <button className='ui red basic button' role='button' onClick={() => this.cancelProject(address)}>
                            Projekt abbrechen
                        </button>
                    </div>,
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
                extra:
                    <div className='ui three buttons'>
                        <button className='ui green basic button' role='button'>
                            <Link route={`/projekte/offen/${address}/beenden`}>
                                <a>Projekt abschließen</a>
                            </Link>
                        </button>
                        <button className='ui red basic button' role='button' onClick={() => this.callInvestigator(address)}>
                            Projekt melden
                        </button>
                    </div>,
                color: 'blue',
                fluid: true,
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={items} />
    }

    renderInvestigationProjects() {
        const items = this.props.projectsUnderInvestigation.slice(0).reverse().map(project => {
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
                color: 'red',
                fluid: true,
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                {this.props.openStartupProjects.length > 0 ? this.renderOpenStartupProjects() : <p>Keine Projekt als Startup</p>}
                {this.props.openFreelancerProjects.length > 0 ? this.renderOpenFreelancerProjects() : <p>Keine Projekte als Freelancer</p>}
                {this.props.projectsUnderInvestigation.length > 0 ? this.renderInvestigationProjects() : <p>Keine Projektein in Untersuchung</p>}
            </Layout>
        );
    }
}

export default OpenProjects;
