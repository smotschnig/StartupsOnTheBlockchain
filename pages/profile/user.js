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
            console.log("existiert");
        } else {
            console.log("existiert nicht");
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
        showCreateButton: true,
        showUpdateButton: false
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            const profileExists = await factory.methods.profileAlreadyExists(accounts[0]).call();

            if (!profileExists) {
                await factory.methods
                    .createProfile(this.state.fName, this.state.lName, this.state.birthDate, this.state.education, this.state.experience, this.state.skills)
                    .send({
                        from: accounts[0]
                    });
                this.setState({ showCreateButton: false });
                Router.pushRoute('/');
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
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
                <h3>User Profile</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>First Name</label>
                        <small>* required</small>
                        <Input
                            placeholder='John'
                            value={this.state.fName}
                            onChange={event => this.setState({ fName: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <small>* required</small>
                        <Input
                            placeholder='Doe'
                            value={this.state.lName}
                            onChange={event => this.setState({ lName: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Birth Date</label>
                        <small>* required</small><br />
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
                        <label>Education</label>
                        <textarea
                            placeholder="School, Vocationoal Training, Academic Education"
                            value={this.state.education}
                            onChange={event => this.setState({ education: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Experience</label>
                        <textarea
                            placeholder="Work Experience, Further Education, Certificates"
                            value={this.state.experience}
                            onChange={event => this.setState({ experience: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Skills</label>
                        <small>Please use comma separated values.</small>
                        <Input
                            placeholder='HTML, CSS, JavaScript'
                            value={this.state.skills}
                            onChange={event => this.setState({ skills: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Error!' content={this.state.errorMessage.split('\n')[0]} />
                    {this.state.showCreateButton ? <Button loading={this.state.loading} type='submit' content='Create Account' icon='check' primary /> : null}
                </Form>
            </Layout>
        );
    }
}

export default UserProfile;