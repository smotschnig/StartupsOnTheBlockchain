import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

/**
 * '/projekt/neu'
 * user can create a new project as startup
 */
class ProjectNew extends Component {
    state = {
        startup: '',
        title: '',
        deadline: '',
        description: '',
        wage: '',
        profileBalance: '',
        userHasNoProfile: false,
        errorMessage: '',
        loading: false,
        inputIncomplete: false
    };

    /**
     * checking if user has already created a profile
     * getting balance of current MetaMask account
     */
    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        const profileAddress = await factory.methods.profileDeployedAddress(accounts[0]).call();
        const noProfileAddress = '0x0000000000000000000000000000000000000000';

        if (profileAddress === noProfileAddress) {
            this.setState({ userHasNoProfile: true });
        }

        this.setState({ profileBalance: balance });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            /**
             * user has to fill in:
             * name for startup
             * title of searched job
             * wage as ETH
             */
            if (this.state.startup === '' || this.state.title === '' || this.state.wage === '') {
                this.setState({ errorMessage: 'Eingaben unvollständig.', inputIncomplete: true });
            }

            /**
             * user must create profile first
             */
            if (this.state.userHasNoProfile) {
                this.setState({ errorMessage: 'Bitte erstellen Sie vorher ein Profil.', inputIncomplete: true });
            }

            /**
             * MetaMask account balance must be higher than wage
             */
            if (this.state.profileBalance < this.state.wage) {
                this.setState({ errorMessage: 'Nicht genügend Guthaben.', inputIncomplete: true });
            }

            /**
             * if there is no error, project will be created and wage belongs to the project
             */
            if (!this.state.inputIncomplete) {
                await factory.methods
                    .createProject(this.state.startup, this.state.title, this.state.deadline, this.state.description)
                    .send({
                        from: accounts[0],
                        value: web3.utils.toWei(this.state.wage, 'ether')
                    });
                Router.pushRoute('/');
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, inputIncomplete: true });
    }

    /**
     * setting change handler for calendar
     */
    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }

    /**
     * showing serveral form for creating new project
     */
    render() {
        const { Field } = Form;
        const {
            startup,
            title,
            deadline,
            description,
            wage,
            userHasNoProfile,
            errorMessage,
            loading,
        } = this.state;

        return (
            <Layout>
                <h3>Neues Projekt</h3>
                {!userHasNoProfile ? null :
                    <Message warning>
                        <Message.Header>Profil erforderlich!</Message.Header>
                        <p>Bitte erstellen Sie zunächst ein Profil, um ein neues Projekt erstellen zu können.</p>
                    </Message>
                }
                <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                    <Field>
                        <label>Name des Startups</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder='Firma XY'
                            value={startup}
                            onChange={event => this.setState({ startup: event.target.value })}
                        />
                    </Field>
                    <Field>
                        <label>Gesuchte Berufsbezeichnung</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder='Webentwickler (m/w)'
                            value={title}
                            onChange={event => this.setState({ title: event.target.value })}
                        />
                    </Field>
                    <Field>
                        <label>Deadline</label>
                        <small>DD.MM.YYYY</small>
                        <DateInput
                            placeholder='01.01.2030'
                            name="deadline"
                            value={deadline}
                            iconPosition="left"
                            onChange={this.handleChange}
                            dateFormat="DD.MM.YYYY"
                        />
                    </Field>
                    <Field>
                        <label>Projektbeschreibung</label>
                        <textarea
                            placeholder='Ort, Voraussetzungen, Details,...'
                            value={description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Field>
                    <Field>
                        <label>Vergütung</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder='0.05'
                            label='ETH'
                            labelPosition='right'
                            value={wage}
                            onChange={event => this.setState({ wage: event.target.value })}
                        />
                    </Field>
                    <Message error header='Fehler!' content={errorMessage.split('\n')[0]} />
                    <Button loading={loading} primary type='submit' icon='add circle' content='Projekt erstellen' />
                </Form>
            </Layout>
        );
    }
}

export default ProjectNew;