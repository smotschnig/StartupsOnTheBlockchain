import React, { Component } from 'react';
import { Button, Form, Input, Message, TextArea } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class ProjectNew extends Component {
    static async getInitialProps() {
        console.log('factory', factory);

        const projects = await factory.methods.getDeployedProjects().call();

        return {
            projects
        };
    }

    state = {
        Startup: '',
        Title: '',
        Deadline: '',
        Description: '',
        Wage: '',
        Date: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createProject(this.state.Startup, this.state.Title, this.state.Deadline, this.state.Description, this.state.Wage, this.state.Date)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false});
    };

    render() {
        return (
            <Layout>
                <h3>Create a Project</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Name of Startup</label>
                        <Input
                            value={this.state.Startup}
                            onChange={event => this.setState({ Startup: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Title of Job </label>
                        <Input
                            value={this.state.Title}
                            onChange={event => this.setState({ Title: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Deadline</label>
                        <Input
                            value={this.state.Deadline}
                            onChange={event => this.setState({ Deadline: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <textarea
                            value={this.state.Description}
                            onChange={event => this.setState({ Description: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Wage</label>
                        <Input
                            label='wei'
                            labelPosition='right'
                            value={this.state.Wage}
                            onChange={event => this.setState({ Wage: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Error!' content={this.state.errorMessage.split('\n')[0]} />
                    <Button loading={this.state.loading} primary type='submit' icon='add circle' content='Add Project' />
                </Form>
            </Layout>
        );
    }
}

export default ProjectNew;