import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Table, Message, Checkbox } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import Project from '../ethereum/project';
import Profile from '../ethereum/profile';
import ProjectRow from '../components/ProjectRow';

/**
 * landing page
 */
class StartupIndex extends Component {
    state = {
        hasMetaMask: undefined,
        showOpenProjects: true,
        showAssignedProjects: true,
        showUnderInvestigation: true,
        showFinishedProjects: true
    };

    async componentDidMount() {
        const address = await web3.eth.getAccounts();
        this.setState({
            hasMetaMask: address !== undefined ? address[0] : null
        });
    }

    static async getInitialProps() {
        const projectAddresses = await factory.methods.getDeployedProjects().call();
        const profileAddresses = await factory.methods.getDeployedProfiles().call();
        let projects = [];

        /**
         * iteration over all projects
         */
        try {
            for (let i = 0; i < projectAddresses.length; i++) {
                const project = Project(projectAddresses[i]);
                const summary = await project.methods.getSummary().call();
                const isFinished = await project.methods.isFinished().call();
                const underInvestigation = await project.methods.underInvestigation().call();
                const isOpen = await project.methods.isOpen().call();

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

                projects.push({
                    address: projectAddresses[i],
                    startup: summary[0],
                    title: summary[1],
                    date: summary[4],
                    wage: summary[5],
                    isFinished: isFinished,
                    underInvestigation: underInvestigation,
                    isOpen: isOpen,
                    rating: rating,
                    ratingsCounter: ratingsCounter
                });
            }
        } catch (err) {
            console.log(err);
        }
        
        return {
            projects
        };
    }

    renderRows() {
        return this.props.projects.slice(0).reverse().map((project, index) => {
            const {
                startup,
                title,
                wage,
                date,
                address,
                isFinished,
                underInvestigation,
                isOpen,
                rating,
                ratingsCounter
            } = project;

            const {
                hasMetaMask,
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
                    underInvestigation={underInvestigation}
                    isOpen={isOpen}
                    rating={rating}
                    ratingsCounter={ratingsCounter}
                    ownProject={false}
                    hasMetaMask={hasMetaMask}
                    showOpenProjects={showOpenProjects}
                    showAssignedProjects={showAssignedProjects}
                    showFinishedProjects={showFinishedProjects}
                    showUnderInvestigation={showUnderInvestigation}
                />
            );
        });
    }

    render() {
        const { Header, Row, HeaderCell } = Table;

        return (
            <Layout>
                <h3>Projektübersicht</h3>
                {this.state.hasMetaMask ? null :
                    <Message warning>
                        <Message.Header>MetaMask erforderlich!</Message.Header>
                        <p>Um die Plattform uneingeschränkt nutzen zu können, melden Sie sich bitte mit MetaMask an.</p>
                    </Message>
                }
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
                            <HeaderCell>Details</HeaderCell>
                        </Row>
                    </Header>
                    {this.renderRows()}
                </Table>
            </Layout >
        );
    }
}

export default StartupIndex;