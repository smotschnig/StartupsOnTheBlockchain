import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Grid, Button, Input, Message, Form } from 'semantic-ui-react';
import { Link } from '../../../routes';
import web3 from '../../../ethereum/web3';
import { Router } from '../../../routes';
import Project from '../../../ethereum/project';
import factory from '../../../ethereum/factory';


class Request extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            info: '',
            project: undefined,
            errorMessage: '',
            incorrectInput: false,
            loading: false
        }
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

            // console.log(manager);
            // console.log(accounts[0]);

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

                Router.pushRoute('/');
            }

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }


        this.setState({ loading: false, incorrectInput: false });
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Link to={`/projekt/${this.props.url.query.address}`}>
                                <a>
                                    <Button size='mini'>Zurück</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <h3>Bewerbungsdetails</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Email-Adresse</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder="johndoe@xyz.de"
                            value={this.state.email}
                            onChange={event => this.setState({ email: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Informationen</label>
                        <textarea
                            placeholder='Fragen, Anregungen, Hinweise,...'
                            value={this.state.info}
                            onChange={event => this.setState({ info: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Fehler!' content={this.state.errorMessage.split('\n')[0]} />
                    <Button loading={this.state.loading} type='submit' content='Bewerbung versenden' icon='check' primary />
                </Form>
            </Layout>
        );
    }
}

export default Request;
