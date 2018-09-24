import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class ProjectNew extends Component {
    state = {
        startup: '',
        title: '',
        deadline: '',
        description: '',
        wage: '',
        errorMessage: '',
        loading: false,
        inputIncomplete: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        console.log(this.state.wage);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            const profileAddress = await factory.methods.profileDeployedAddress(accounts[0]).call();
            const userHasNoProfile = '0x0000000000000000000000000000000000000000';

            console.log(this.state.wage);

            if (this.state.startup === '' || this.state.title === '' || this.state.wage === '') {
                this.setState({ inputIncomplete: true, errorMessage: 'Eingaben unvollständig.' });
            }

            if (profileAddress === userHasNoProfile) {
                this.setState({ errorMessage: 'Bitte erstellen Sie vorher ein Profil.', incorrectInput: true });
            }

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

    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }

    render() {
        return (
            <Layout>
                <h3>Erstelle ein neues Projekt</h3>
                {console.log(this.state.wage)}
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Name des Startups</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder='Firma XY'
                            value={this.state.startup}
                            onChange={event => this.setState({ startup: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Gesuchte Berufsbezeichnung</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder='Webentwickler (m/w)'
                            value={this.state.title}
                            onChange={event => this.setState({ title: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        {/* TODO: Datum nur in Zukunft || Vergleich mit moment now */}
                        <label>Deadline</label>
                        <small>DD.MM.YYYY</small>
                        <DateInput
                            placeholder='01.01.2030'
                            name="deadline"
                            value={this.state.deadline}
                            iconPosition="left"
                            onChange={this.handleChange}
                            dateFormat="DD.MM.YYYY"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Projektbeschreibung</label>
                        <textarea
                            placeholder='Ort, Voraussetzungen, Details,...'
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Vergütung</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder='0.05'
                            label='ETH'
                            labelPosition='right'
                            value={this.state.wage}
                            onChange={event => this.setState({ wage: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Fehler!' content={this.state.errorMessage.split('\n')[0]} />
                    <Button loading={this.state.loading} primary type='submit' icon='add circle' content='Projekt erstellen' />
                </Form>
            </Layout>
        );
    }
}

export default ProjectNew;