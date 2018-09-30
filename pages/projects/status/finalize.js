import React, { Component } from 'react'
import Layout from '../../../components/Layout';
import { Grid, Form, Message, Button, Dropdown } from 'semantic-ui-react';
import { Router } from '../../../routes';
import { Link } from '../../../routes';
import web3 from '../../../ethereum/web3';
import Project from '../../../ethereum/project';
import Profile from '../../../ethereum/profile';
import factory from '../../../ethereum/factory';

/**
 * '/projekte/:address/beenden'
 * freelancer and manager can finalize project
 */
class FinalizeProject extends Component {
    state = {
        rating: '',
        project: undefined,
        projectAddress: undefined,
        errorMessage: '',
        successMessage: '',
        errorOccured: false,
        loading: false
    };

    /**
     * getting current project and project data
     */
    async componentDidMount() {
        const projectAddress = this.props.url.query.address;
        const project = Project(projectAddress);
        this.setState({
            project: project,
            projectAddress: projectAddress
        });
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '', successMessage: '' });

        try {
            /**
             * getting information about the project, the freelancer and the project manager
             */
            const project = this.state.project;
            const accounts = await web3.eth.getAccounts();
            const currentUser = accounts[0];
            const manager = await project.methods.manager().call();
            const summary = await project.methods.getSummary().call();
            const wage = summary[5];
            const finalizedByFreelancer = await project.methods.finalizedByFreelancer().call();
            const finalizedByStartup = await project.methods.finalizedByStartup().call();
            const freelancer = summary[6];
            const noFreelancerChosen = '0x0000000000000000000000000000000000000000';

            /**
             * getting the freelancer profileAddress for the rating system
             */
            let freelancerProfileAddress;
            if (summary[6] !== noFreelancerChosen) {
                const profileFreelancerAddress = await factory.methods.profileDeployedAddress(freelancer).call();
                const freelancerProfile = Profile(profileFreelancerAddress);
                freelancerProfileAddress = freelancerProfile._address;
            }

            /**
             * getting the manager profileAddress for the rating system
             */
            const profileManagerAddress = await factory.methods.profileDeployedAddress(manager).call();
            const managerProfile = Profile(profileManagerAddress);
            const managerProfileAddress = managerProfile._address;

            /**
             * checking if current user is project manager
             */
            if (currentUser === manager) {

                /**
                 * user must set a rating
                 */
                if (this.state.rating === '' || this.state.rating === undefined) {
                    this.setState({ errorMessage: 'Bitte bewerten Sie das Projekt.', errorOccured: true });
                }

                /**
                 * freelancer must finalze project first
                 */
                if (!finalizedByFreelancer) {
                    this.setState({ errorMessage: 'Der ausgewählte Freelancer muss das Projekt erst beenden.', errorOccured: true });
                }

                /**
                 * project can only finalized once by startup manager
                 */
                if (finalizedByStartup) {
                    this.setState({ errorMessage: 'Sie haben das Projekt bereits beendet.', errorOccured: true });
                }

                /**
                 * if there is no error, project will be finalized and message about the wage for the freelancer appears
                 */
                if (!this.state.errorOccured) {
                    await project.methods.finalizeProjectAsStartup(freelancerProfileAddress, this.state.rating).send({
                        from: accounts[0]
                    });
                    this.setState({ successMessage: `Dem Freelancer wird eine Vergütung in Höhe von ${web3.utils.fromWei(wage, 'ether')} ETH gutgeschrieben.` });
                }
            }

            /**
             * checking if current user is chosen freelancer of the project
             */
            if (currentUser === freelancer) {

                /**
                 * user must set a rating
                 */
                if (this.state.rating === '' || this.state.rating === undefined) {
                    this.setState({ errorMessage: 'Bitte bewerten Sie das Projekt.', errorOccured: true });
                }

                /**
                 * project can only finalized once by freelancer
                 */
                if (finalizedByFreelancer) {
                    this.setState({ errorMessage: 'Sie haben das Projekt bereits beendet.', errorOccured: true });
                }

                /**
                 * if there is no error, variable finalizedByFreelancer gets set to true and freelancer gets send back to project overview
                 */
                if (!this.state.errorOccured) {
                    await project.methods.finalizeProjectAsFreelancer(managerProfileAddress, this.state.rating).send({
                        from: accounts[0]
                    });
                    Router.pushRoute(`/projekt/${this.state.projectAddress}`);
                }
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, errorOccured: false });
    };

    /**
     * showing rating dropdown and finalize button
     */
    render() {
        const {
            errorMessage,
            successMessage,
            loading
        } = this.state;

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
                            <Link to={`/projekt/${this.state.projectAddress}`} >
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
                            onChange={(e, { value }) => this.setState({ rating: value })}
                        />
                        {console.log(this.state.rating)}
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
