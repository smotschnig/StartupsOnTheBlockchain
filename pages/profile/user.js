import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router } from '../../routes';
import web3 from '../../ethereum/web3';
import { DateInput } from 'semantic-ui-calendar-react';
import factory from '../../ethereum/factory';
import Profile from '../../ethereum/profile';

class UserProfile extends Component {
    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const profileExists = await factory.methods.profileAlreadyExists(accounts[0]).call();

        if (profileExists) {
            this.setState({ showUpdateButton: true, showCreateButton: false });

            const profileAddress = await factory.methods.profileDeployedAddress(accounts[0]).call();
            const profile = Profile(profileAddress);
            const profileData = await profile.methods.getInstructor().call();

            this.setState({
                fName: profileData[0],
                lName: profileData[1],
                birthDate: profileData[2],
                education: profileData[3],
                experience: profileData[4],
                skills: profileData[5]
            });
        } else {
            this.setState({ showUpdateButton: false, showCreateButton: true });
        }
    }

    state = {
        fName: '',
        lName: '',
        birthDate: '',
        education: '',
        experience: '',
        skills: '',
        errorMessage: '',
        loading: false,
        showCreateButton: false,
        showUpdateButton: false,
        inputIncomplete: false
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            const profileExists = await factory.methods.profileAlreadyExists(accounts[0]).call();

            if (this.state.fName === 'asd' || this.state.lName === '' || this.state.birthDate === '') {
                this.setState({ inputIncomplete: true, errorMessage: 'Eingaben unvollständig.' });
            }

            if (!profileExists && !this.state.inputIncomplete) {
                await factory.methods
                    .createProfile(this.state.fName, this.state.lName, this.state.birthDate, this.state.education, this.state.experience, this.state.skills)
                    .send({
                        from: accounts[0]
                    });

                Router.pushRoute('/');
            }

            if (profileExists) {
                const profileAddress = await factory.methods.profileDeployedAddress(accounts[0]).call();
                const profile = Profile(profileAddress);
                await profile.methods.setInstructor(this.state.fName, this.state.lName, this.state.birthDate, this.state.education, this.state.experience, this.state.skills)
                    .send({
                        from: accounts[0]
                    });
            }


        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, inputIncomplete: false });
    };

    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }

    render() {
        return (
            <Layout>
                {/* TODO: Error Handling */}
                <h3>Benutzerprofil</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Vorname</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder="John"
                            value={this.state.fName}
                            onChange={event => this.setState({ fName: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Nachname</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder='Doe'
                            value={this.state.lName}
                            onChange={event => this.setState({ lName: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Geburtstdatum</label>
                        <small>* erforderlich</small><br />
                        <small>DD.MM.YYYY</small>
                        <DateInput
                            name="birthDate"
                            placeholder="Date"
                            value={this.state.birthDate}
                            iconPosition="left"
                            onChange={this.handleChange}
                            dateFormat="DD.MM.YYYY"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Ausbildungsinformationen</label>
                        <textarea
                            placeholder="School, Vocationoal Training, Academic Education"
                            value={this.state.education}
                            onChange={event => this.setState({ education: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Sonstige Erfahrungen</label>
                        <textarea
                            placeholder="Work Experience, Further Education, Certificates"
                            value={this.state.experience}
                            onChange={event => this.setState({ experience: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Skills</label>
                        <small>Bitte durch Kommata getrennte Werte angeben.</small>
                        <Input
                            placeholder='HTML, CSS, JavaScript'
                            value={this.state.skills}
                            onChange={event => this.setState({ skills: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Fehler!' content={this.state.errorMessage.split('\n')[0]} />
                    {this.state.showCreateButton ? <Button loading={this.state.loading} type='submit' content='Create Account' icon='check' primary /> : null}
                    {this.state.showUpdateButton ? <Button loading={this.state.loading} type='submit' content='Update' icon='check' primary /> : null}
                </Form>
            </Layout>
        );
    }
}

export default UserProfile;