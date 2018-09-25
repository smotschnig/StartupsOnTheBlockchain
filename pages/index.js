import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Table } from 'semantic-ui-react';
import _ from 'lodash';
import factory from '../ethereum/factory';
import Project from '../ethereum/project';
import Profile from '../ethereum/profile';
import web3 from '../ethereum/web3';

import ProjectRow from '../components/ProjectRow';

class StartupIndex extends Component {
    static async getInitialProps() {
        const projectAddresses = await factory.methods.getDeployedProjects().call();
        const profileAddresses = await factory.methods.getDeployedProfiles().call();
        let projects = [];

        for (let i = 0; i < projectAddresses.length; i++) {
            const project = Project(projectAddresses[i]);
            const summary = await project.methods.getSummary().call();

            let rating;
            let ratingsCounter;

            for (let j = 0; j < profileAddresses.length; j++) {
                const profile = Profile(profileAddresses[j]);
                const profileManager = await profile.methods.manager().call();
                if (profileManager === summary[8]) {
                    rating = await profile.methods.rating().call();
                    ratingsCounter = await profile.methods.ratingsCounter().call();
                }
            }

            projects.push({
                address: projectAddresses[i],
                startup: summary[0],
                title: summary[1],
                wage: summary[6],
                date: summary[4],
                isFinished: summary[5],
                underInvestigation: summary[9],
                rating: rating,
                ratingsCounter: ratingsCounter
            });
        }

        return {
            projects
        };
    }

    renderRows() {
        return this.props.projects.slice(0).reverse().map((project, index) => {
            const { startup, title, wage, date, address, isFinished, underInvestigation, rating, ratingsCounter } = project;
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
                    rating={rating}
                    ratingsCounter={ratingsCounter}
                />
            );
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
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
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
            </Layout >
        );
    }
}

export default StartupIndex;