import React, { Component } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import RatingStars from './RatingStars';
import LinkConnector from './LinkConnector';
import TimeConverter from './TimeConverter';

class ProjectRow extends Component {

    renderIndexRow() {
        const { Row, Cell } = Table;
        const {
            startup,
            title,
            wage,
            date,
            address,
            isFinished,
            isOpen,
            underInvestigation,
            rating,
            ratingsCounter,
            hasMetaMask,
            showOpenProjects,
            showAssignedProjects,
            showFinishedProjects,
            showUnderInvestigation
        } = this.props;

        /**
         * averageRating is the sum of the valuations divided by the number of valuations
         */
        if ((showUnderInvestigation && underInvestigation) ||
            (showFinishedProjects && isFinished) ||
            (showOpenProjects && !isFinished && isOpen) ||
            (showAssignedProjects && !isOpen && !underInvestigation && !isFinished)) {
            return (
                <Row disabled={isFinished} negative={underInvestigation} positive={isOpen}>
                    <Cell>{startup}</Cell>
                    <Cell><RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})</Cell>
                    <Cell>{title}</Cell>
                    <Cell>{web3.utils.fromWei(wage, 'ether')}</Cell>
                    <Cell><TimeConverter date={date} /></Cell>
                    {isOpen ?
                        <Cell>
                            {isFinished || !hasMetaMask ? null :
                                <LinkConnector button={true} color={'green'} route={`/projekt/${address}`} text='Projekt ansehen' />
                            }
                        </Cell>
                        :
                        <Cell>
                            {isFinished || !hasMetaMask ? null :
                                <LinkConnector button={true} color={'grey'} route={`/projekt/${address}`} text='Projekt ansehen' />
                            }
                        </Cell>
                    }
                </Row>
            );
        }
    }

    renderProjectRow() {
        const { Row, Cell } = Table;
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
            showOpenProjects,
            showAssignedProjects,
            showFinishedProjects,
            showUnderInvestigation,
            rating,
            ratingsCounter
        } = this.props;

        /**
          * averageRating is the sum of the valuations divided by the number of valuations
          */
        if ((showUnderInvestigation && underInvestigation) ||
            (showFinishedProjects && isFinished) ||
            (showOpenProjects && !isFinished && isOpen) ||
            (showAssignedProjects && !isOpen && !underInvestigation && !isFinished)) {
            return (
                <Row disabled={isFinished} negative={underInvestigation} positive={isOpen}>
                    <Cell>{startup}</Cell>
                    <Cell><RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})</Cell>
                    <Cell>{title}</Cell>
                    <Cell>{web3.utils.fromWei(wage, 'ether')}</Cell>
                    <Cell><TimeConverter date={date} /></Cell>
                    <Cell>{finalizedByFreelancer ? <Icon name="check" /> : null}</Cell>
                    <Cell>{finalizedByStartup ? <Icon name="check" /> : null}</Cell>
                    <Cell>
                        {isFinished ? null :
                            <LinkConnector button={true} color={'green'} route={`/projekt/${address}`} text='Projekt ansehen' />
                        }
                    </Cell>
                </Row>
            );
        }
    }

    render() {
        const { Body } = Table;
        const { ownProject } = this.props;

        return (
            <Body>
                {ownProject ? this.renderProjectRow() : this.renderIndexRow()}
            </Body>
        );
    }
}

export default ProjectRow;