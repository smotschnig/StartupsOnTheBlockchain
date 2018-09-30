import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Grid, Button, Input, Message, Form } from 'semantic-ui-react';
import { Link } from '../../../routes';
import web3 from '../../../ethereum/web3';
import { Router } from '../../../routes';
import Project from '../../../ethereum/project';
import factory from '../../../ethereum/factory';

/**
 * '/projekt/:address/bewerbung'
 * user can create a new project as startup
 */
class Request extends Component {
    state = {
        email: '',
        info: '',
        project: undefined,
        errorMessage: '',
        incorrectInput: false,
        loading: false
    }

    async componentDidMount() {
        const project = Project(this.props.url.query.address);
        this.setState({ project: project });
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const project = this.state.project;

            const accounts = await web3.eth.getAccounts();
            const alreadyRequester = await project.methods.requester(accounts[0]).call();
            const manager = await project.methods.manager().call();
            const profileAddress = await factory.methods.profileDeployedAddress(accounts[0]).call();
            const userHasNoProfile = '0x0000000000000000000000000000000000000000';

            if (this.state.email === '') {
                this.setState({ errorMessage: 'Eingaben unvollständig.', incorrectInput: true });
            }

            if (profileAddress === userHasNoProfile) {
                this.setState({ errorMessage: 'Bitte erstellen Sie vorher ein Profil.', incorrectInput: true });
            }

            if (alreadyRequester) {
                this.setState({ errorMessage: 'Ihre Bewerbung liegt bereits vor.', incorrectInput: true });
            }

            if (manager === accounts[0]) {
                this.setState({ errorMessage: 'Sie können sich nicht für Ihr eigenes Projekt bewerben.', incorrectInput: true });
            }

            if (!this.state.incorrectInput) {
                await project.methods.setRequest(this.state.email, this.state.info)
                    .send({
                        from: accounts[0]
                    });

                Router.pushRoute(`/projekt/${this.props.url.query.address}`);
            }

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, incorrectInput: false });
    }

    render() {
        const {
            email,
            info,
            errorMessage,
            loading
        } = this.state;

        const {
            url
        } = this.props;

        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Link to={`/projekt/${url.query.address}`}>
                                <a>
                                    <Button size='mini'>Zurück</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <h3>Bewerbungsdetails</h3>
                <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                    <Form.Field>
                        <label>Email-Adresse</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder="johndoe@xyz.de"
                            value={email}
                            onChange={event => this.setState({ email: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Informationen</label>
                        <textarea
                            placeholder='Fragen, Anregungen, Hinweise,...'
                            value={info}
                            onChange={event => this.setState({ info: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Fehler!' content={errorMessage.split('\n')[0]} />
                    <Button loading={loading} type='submit' content='Bewerbung versenden' icon='check' primary />
                </Form>
            </Layout>
        );
    }
}

export default Request;
