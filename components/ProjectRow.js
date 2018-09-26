import React, { Component } from 'react';
import { Table, Button, Icon, Label } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import moment from 'moment';
import { Link } from '../routes';
import RatingStars from './RatingStars';
import LinkConnector from './LinkConnector';
import TimeConverter from './TimeConverter';

class ProjectRow extends Component {
    /**
     * if project is not finished yet or under investigation, user can view some details
     */
    viewProject(address) {
        <Link route={`/projekt/${address}`}>
            <a>Projekt ansehen</a>
        </Link>
    };

    /**
     * formatted date (german style)
     */
    timeConverter(timestamp) {
        var date = moment.unix(timestamp);
        return date.format("DD.MM.YYYY");
    }

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
            (showAssignedProjects && !isOpen)) {
            return (
                <Row disabled={isFinished} negative={underInvestigation}>
                    <Cell>{startup}</Cell>
                    <Cell><RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})</Cell>
                    <Cell>{title}</Cell>
                    <Cell>{web3.utils.fromWei(wage, 'ether')}</Cell>
                    <Cell><TimeConverter date={date} /></Cell>
                    <Cell>
                        {isFinished || !hasMetaMask ? null :
                            <LinkConnector button={true} route={`/projekt/${address}`} text='Projekt ansehen' />
                        }
                    </Cell>
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
            (showAssignedProjects && !isOpen)) {
            return (
                <Row disabled={isFinished} negative={underInvestigation} >
                    <Cell>{startup}</Cell>
                    <Cell><RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})</Cell>
                    <Cell>{title}</Cell>
                    <Cell>{web3.utils.fromWei(wage, 'ether')}</Cell>
                    <Cell>{this.timeConverter(date)}</Cell>
                    <Cell>{finalizedByFreelancer ? <Icon name="check" /> : <Label size="tiny" >pending...</Label>}</Cell>
                    <Cell>{finalizedByStartup ? <Icon name="check" centered /> : <Label size="tiny" >pending...</Label>}</Cell>
                    <Cell>
                        {isFinished ? null :
                            <Link route={`/projekt/${address}`}>
                                <a>
                                    <Button color="green" basic>Projekt ansehen</Button>
                                </a>
                            </Link>
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