import React, { Component } from 'react'
import Layout from '../../../components/Layout';
import { Table, Checkbox } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import ProjectRow from '../../../components/ProjectRow';
import Project from '../../../ethereum/project';
import Profile from '../../../ethereum/profile';
import factory from '../../../ethereum/factory';

/**
 * '/projekte/:address'
 * listing all project which belongs to the current user
 */
class OpenProjects extends Component {
    state = {
        showOpenProjects: true,
        showAssignedProjects: true,
        showUnderInvestigation: true,
        showFinishedProjects: true
    };

    static async getInitialProps() {
        const accounts = await web3.eth.getAccounts();
        const projectAddresses = await factory.methods.getDeployedProjects().call();
        const profileAddresses = await factory.methods.getDeployedProfiles().call();

        let openProjects = [];

        /**
         * iteration over all projects, lists those where 
         * current MetaMask account == manager (as startup)
         * current MetaMask account == chosenFreelancer
         */
        try {
            for (let i = 0; i < projectAddresses.length; i++) {
                const project = Project(projectAddresses[i]);
                const manager = await project.methods.manager().call();
                const chosenFreelancer = await project.methods.getApplicantInfo(accounts[0]).call();

                if (accounts[0] === manager || chosenFreelancer[2]) {
                    const summary = await project.methods.getSummary().call();
                    const projectWage = await project.methods.projectWage().call();
                    const isFinished = await project.methods.isFinished().call();
                    const underInvestigation = await project.methods.underInvestigation().call();
                    const isOpen = await project.methods.isOpen().call();
                    const finalizedByFreelancer = await project.methods.finalizedByFreelancer().call();
                    const finalizedByStartup = await project.methods.finalizedByStartup().call();

                    let rating;
                    let ratingsCounter;

                    /**
                     * iteration over all profiles to check the manager's profile for the rating calculation
                     */
                    for (let j = 0; j < profileAddresses.length; j++) {
                        const profile = Profile(profileAddresses[j]);
                        const profileManager = await profile.methods.manager().call();
                        if (profileManager === summary[7]) {
                            rating = await profile.methods.rating().call();
                            ratingsCounter = await profile.methods.ratingsCounter().call();
                        }
                    }

                    openProjects.push({
                        address: projectAddresses[i],
                        startup: summary[0],
                        title: summary[1],
                        wage: projectWage,
                        date: summary[4],
                        isFinished: isFinished,
                        underInvestigation: underInvestigation,
                        isOpen: isOpen,
                        finalizedByFreelancer: finalizedByFreelancer,
                        finalizedByStartup: finalizedByStartup,
                        rating: rating,
                        ratingsCounter: ratingsCounter
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }

        return {
            openProjects
        };
    }

    /**
     * calling the component 'ProjectRow' with several props
     */
    renderRows() {
        return this.props.openProjects.slice(0).reverse().map((project, index) => {
            const {
                startup,
                title,
                wage,
                date,
                address,
                isFinished,
                isOpen,
                underInvestigation,
                finalizedByFreelancer,
                finalizedByStartup,
                rating,
                ratingsCounter
            } = project;

            const {
                showOpenProjects,
                showAssignedProjects,
                showFinishedProjects,
                showUnderInvestigation
            } = this.state;

            return (
                <ProjectRow
                    key={index}
                    startup={startup}
                    title={title}
                    wage={wage}
                    date={date}
                    address={address}
                    isFinished={isFinished}
                    isOpen={isOpen}
                    underInvestigation={underInvestigation}
                    finalizedByFreelancer={finalizedByFreelancer}
                    finalizedByStartup={finalizedByStartup}
                    rating={rating}
                    ratingsCounter={ratingsCounter}
                    showOpenProjects={showOpenProjects}
                    showAssignedProjects={showAssignedProjects}
                    showFinishedProjects={showFinishedProjects}
                    showUnderInvestigation={showUnderInvestigation}
                    ownProject={true}
                />
            );
        });
    }

    /**
     * showing all projects for current user in form of a table with filtering function
     */
    render() {
        const {
            Header,
            Row,
            HeaderCell
        } = Table;

        return (
            <Layout>
                <h3>Eigene Projekte</h3>
                <h5>Filter:</h5>
                <span className="filter_checkbox">
                    <Checkbox label='Offene Projekte' onChange={() => this.setState({ showOpenProjects: !this.state.showOpenProjects })} defaultChecked />
                </span>
                <span className="filter_checkbox">
                    <Checkbox label='Vergebene Projekte' onChange={() => this.setState({ showAssignedProjects: !this.state.showAssignedProjects })} defaultChecked />
                </span>
                <span className="filter_checkbox">
                    <Checkbox label='Abgeschlossenene Projekte' onChange={() => this.setState({ showFinishedProjects: !this.state.showFinishedProjects })} defaultChecked />
                </span>
                <span className="filter_checkbox">
                    <Checkbox label='Gemeldete Projekte' onChange={() => this.setState({ showUnderInvestigation: !this.state.showUnderInvestigation })} defaultChecked />
                </span>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Startup</HeaderCell>
                            <HeaderCell>Bewertung</HeaderCell>
                            <HeaderCell>Berufsbezeichnung</HeaderCell>
                            <HeaderCell>Ether</HeaderCell>
                            <HeaderCell>Datum</HeaderCell>
                            <HeaderCell>Freelancer</HeaderCell>
                            <HeaderCell>Startup</HeaderCell>
                            <HeaderCell>Details</HeaderCell>
                        </Row>
                    </Header>
                    {this.renderRows()}
                </Table>
            </Layout>
        );
    }
}

export default OpenProjects;
