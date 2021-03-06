import React, { Component } from 'react';
import { Table, Button, Form } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import RatingStars from './RatingStars';
import LinkConnector from './LinkConnector';
import { Router } from '../routes';

class RequesterRow extends Component {
    state = {
        loading: false,
        errorMessage: '',
        freelancerHasBeenChosen: false
    }

    chooseRequester = async (address) => {
        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            if (!this.state.freelancerHasBeenChosen) {
                await this.props.project.methods
                    .chooseRequester(address)
                    .send({
                        from: accounts[0]
                    });
                this.setState({ freelancerHasBeenChosen: true });
                Router.pushRoute(`/projekt/${this.props.project._address}`);
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    renderManagerRequesterRow() {
        const { Row, Cell } = Table;
        const {
            address,
            rating,
            ratingsCounter,
            email,
            info,
            projectAddress,
            projectIsOpen
        } = this.props;

        return (
            <Row disabled={!projectIsOpen}>
                <Cell><LinkConnector route={`/projekt/${projectAddress}/${'bewerber'}/${address}`} text={address} label={true} icon='address card' /></Cell>
                <Cell><RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})</Cell>
                <Cell>{email}</Cell>
                <Cell>{info}</Cell>
                <Cell>
                    <Form onSubmit={() => this.chooseRequester(address)}>
                        {projectIsOpen
                            ?
                            <Button loading={this.state.loading} primary type='submit' content='Bewerber auswählen' />
                            :
                            <Button disabled content='Bewerber auswählen' />
                        }
                    </Form>
                </Cell>
            </Row>
        );
    }

    render() {
        const { Body } = Table;
        const { isManager } = this.props;

        return (
            <Body>
                {isManager ? this.renderManagerRequesterRow() : null}
            </Body>
        );
    }
}

export default RequesterRow;