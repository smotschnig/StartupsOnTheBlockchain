import React, { Component } from 'react'
import Layout from '../../../components/Layout';
import { Grid, Form, Message, Button, Dropdown } from 'semantic-ui-react';
import { Router } from '../../../routes';
import { Link } from '../../../routes';
import web3 from '../../../ethereum/web3';
import Project from '../../../ethereum/project';
import Profile from '../../../ethereum/profile';
import factory from '../../../ethereum/factory';

class FinalizeProject extends Component {
    state = {
        rating: '',
        errorMessage: '',
        successMessage: '',
        errorOccured: false,
        loading: false
    };

    static async getInitialProps(props) {
        const projectAddress = props.query.address;
        const project = Project(projectAddress);
        const accounts = await web3.eth.getAccounts();
        const currentUser = accounts[0];
        const manager = await project.methods.manager().call();
        const summary = await project.methods.getSummary().call();
        const wage = summary[5];
        const finalizedByFreelancer = await project.methods.finalizedByFreelancer().call();
        const finalizedByStartup = await project.methods.finalizedByStartup().call();
        const freelancer = summary[6];
        const noFreelancerChosen = '0x0000000000000000000000000000000000000000';

        let freelancerProfileAddress;
        if (summary[6] !== noFreelancerChosen) {
            const profileFreelancerAddress = await factory.methods.profileDeployedAddress(freelancer).call();
            const freelancerProfile = Profile(profileFreelancerAddress);
            freelancerProfileAddress = freelancerProfile._address;
        }

        const profileManagerAddress = await factory.methods.profileDeployedAddress(manager).call();
        const managerProfile = Profile(profileManagerAddress);
        const managerProfileAddress = managerProfile._address;

        return {
            accounts,
            project,
            currentUser,
            manager,
            wage,
            freelancer,
            freelancerProfileAddress,
            finalizedByFreelancer,
            finalizedByStartup,
            managerProfileAddress,
            projectAddress
        };
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '', successMessage: '' });

        const {
            projectAddress,
            finalizedByFreelancer,
            finalizedByStartup,
            wage
        } = this.props;

        try {

            if (this.props.currentUser === this.props.manager) {

                if (finalizedByStartup) {
                    this.setState({ errorMessage: 'Sie haben das Projekt bereits beendet.', errorOccured: true });
                }

                if (!finalizedByFreelancer) {
                    this.setState({ errorMessage: 'Der ausgewählte Freelancer muss das Projekt erst beenden.', errorOccured: true });
                }

                if (!this.state.errorOccured) {
                    await this.props.project.methods.finalizeProjectAsStartup(this.props.freelancerProfileAddress, this.state.rating).send({
                        from: this.props.accounts[0]
                    });
                    this.setState({ successMessage: `Dem Freelancer wird eine Vergütung in Höhe von ${web3.utils.fromWei(wage, 'ether')} ETH gutgeschrieben.` });
                }
            }

            if (this.props.currentUser === this.props.freelancer) {
                if (finalizedByFreelancer) {
                    this.setState({ errorMessage: 'Sie haben das Projekt bereits beendet.', errorOccured: true });
                }

                if (!this.state.errorOccured) {
                    await this.props.project.methods.finalizeProjectAsFreelancer(this.props.managerProfileAddress, this.state.rating).send({
                        from: this.props.accounts[0]
                    });
                    Router.pushRoute(`/projekt/${projectAddress}`);
                }
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, errorOccured: true });
    };

    onChange = (e, { value }) => this.setState({ rating: value })

    render() {
        const {
            errorMessage,
            successMessage,
            loading
        } = this.state;

        const { projectAddress } = this.props;


        const ratingValues = [
            {
                value: 0,
                text: '0  -  sehr schlecht'
            },
            {
                value: 1,
                text: '1  -  schlecht'
            },
            {
                value: 2,
                text: '2  -  akzeptabel'
            },
            {
                value: 3,
                text: '3  -  mittel'
            },
            {
                value: 4,
                text: '4  -  gut'
            },
            {
                value: 5,
                text: '5  -  sehr gut'
            }
        ];

        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Link to={`/projekt/${projectAddress}`} >
                                <a><Button size='mini'>Zurück</Button></a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <h3>Projekt beenden</h3>
                <Form onSubmit={this.onSubmit} error={!!errorMessage} success={!!successMessage} >
                    <Form.Field>
                        <label>Bewerten Sie die Zusammenarbeit im Projekt</label>
                        <small>* erforderlich</small><br />
                        <Dropdown
                            placeholder={ratingValues[0].text}
                            search
                            selection
                            options={ratingValues}
                            value={this.state.rating}
                            onChange={this.onChange}
                        />
                    </Form.Field>
                    <Message error header='Fehler!' content={errorMessage.split('\n')[0]} />
                    <Message success header='Projekt erfolgreich abgeschlossen!' content={successMessage.split('\n')[0]} />
                    <Button loading={loading} type='submit' content='Projekt beenden' icon='check' primary />
                </Form>
            </Layout>
        );
    }
}

export default FinalizeProject;
