import React, { Component } from 'react';
import { Button, Form, Input, Message, TextArea } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class ProjectNew extends Component {
    static async getInitialProps() {
        const projects = await factory.methods.getDeployedProjects().call();

        return {
            projects
        };
    }

    state = {
        startup: '',
        title: '',
        deadline: '',
        description: '',
        wage: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            await factory.methods
                .createProject(this.state.startup, this.state.title, this.state.deadline, this.state.description, this.state.wage)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }

    render() {
        return (
            <Layout>
                <h3>Create a Project</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Name of Startup</label>
                        <Input
                            value={this.state.startup}
                            onChange={event => this.setState({ startup: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Title of Job </label>
                        <Input
                            value={this.state.title}
                            onChange={event => this.setState({ title: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        {/* TODO: Datum nur in Zukunft || Vergleich mit moment now */}
                        <label>Deadline</label>
                        <DateInput
                            name="deadline"
                            placeholder="Date"
                            value={this.state.deadline}
                            iconPosition="left"
                            onChange={this.handleChange}
                            dateFormat="DD.MM.YYYY"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <textarea
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Wage</label>
                        <Input
                            label='wei'
                            labelPosition='right'
                            value={this.state.wage}
                            onChange={event => this.setState({ wage: event.target.value })}
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