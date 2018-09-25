import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import moment from 'moment';
import { Link } from '../routes';
import RatingStars from './RatingStars';

class ProjectRow extends Component {
    viewProject(address) {
        <Link route={`/projekt/${address}`}>
            <a>Projekt ansehen</a>
        </Link>
    };

    timeConverter(timestamp) {
        var date = moment.unix(timestamp);
        return date.format("DD.MM.YYYY - HH:mm");
    }

    render() {
        const { Row, Cell } = Table;
        const { startup, title, wage, date, address, isFinished, underInvestigation, rating, ratingsCounter } = this.props;

        return (
            <Row disabled={isFinished} negative={underInvestigation} >
                <Cell>{startup}</Cell>
                <Cell><RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})</Cell>
                <Cell>{title}</Cell>
                <Cell>{web3.utils.fromWei(wage, 'ether')}</Cell>
                <Cell>{this.timeConverter(date)}</Cell>
                <Cell>
                    {isFinished ? null :
                        <Link route={`/projekt/${address}`}>
                            <a>
                                <Button color="green" basic>Projekt ansehen</Button>
                            </a>
                        </Link>
                    }

                    {/* {!isFinished ?
                        <Link route={`/projekt/${address}`}>
                            <a>Projekt ansehen</a>
                        </Link>
                        : null} */}
                </Cell>
            </Row >
        );
    }
}


export default ProjectRow;