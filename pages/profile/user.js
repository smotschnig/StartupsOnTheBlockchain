import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message, Icon } from 'semantic-ui-react';
import profile from '../../ethereum/profile';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class UserProfile extends Component {
    // static async getInitialProps() {
    //     // console.log('profile', profile);

    //     // const projects = await profile.methods.getInstructors().call();
    //     // const accounts = await web3.eth.getAccounts();

    //     // console.log("accounts", accounts[0]);
    //     // console.log("projects", projects);

    //     // return {
    //     //     projects
    //     // };
    // }

    state = {
        age: '',
        fName: '',
        lName: '',
        training: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            await profile.methods
                .setInstructor(accounts[0], this.state.age, this.state.fName, this.state.lName, this.state.training)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h3>User Profile</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>First Name</label>
                        <Input
                            placeholder='Sven Motschnig'
                            value={this.state.fName}
                            onChange={event => this.setState({ fName: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name</label>
                        <Input
                            value={this.state.lName}
                            onChange={event => this.setState({ lName: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Age</label>
                        <Input
                            value={this.state.age}
                            onChange={event => this.setState({ age: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Training</label>
                        <Input
                            value={this.state.training}
                            onChange={event => this.setState({ training: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Error!' content={this.state.errorMessage.split('\n')[0]} />
                    <Button loading={this.state.loading} type='submit' content='Update' icon='refresh' primary />
                </Form>
            </Layout>
        )
    }
}

export default UserProfile;