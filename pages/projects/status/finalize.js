import React, { Component } from 'react'
import Layout from '../../../components/Layout';
import { Input, Form, Message, Button } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import Project from '../../../ethereum/project';
import Profile from '../../../ethereum/profile';
import factory from '../../../ethereum/factory';

class FinalizeProject extends Component {
    state = {
        rating: 0,
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props) {
        const project = Project(props.query.address);

        const accounts = await web3.eth.getAccounts();
        const currentUser = accounts[0];
        const manager = await project.methods.manager().call();
        console.log("m", manager);
        const summary = await project.methods.getSummary().call();
        const freelancer = summary[7];
        const noFreelancerChosen = '0x0000000000000000000000000000000000000000';
        let freelancerProfileAddress;
        if (summary[7] !== noFreelancerChosen) {
            console.log("f", freelancer);
            const profileFreelancerAddress = await factory.methods.profileDeployedAddress(freelancer).call();
            const freelancerProfile = Profile(profileFreelancerAddress);
            freelancerProfileAddress = freelancerProfile._address;
            console.log("freelancerProfileAddress", freelancerProfileAddress);
        }

        const profileManagerAddress = await factory.methods.profileDeployedAddress(manager).call();
        const managerProfile = Profile(profileManagerAddress);
        const managerProfileAddress = managerProfile._address;
        console.log("managerProfileAddress", managerProfileAddress);

        return {
            accounts,
            project,
            currentUser,
            manager,
            freelancer,
            freelancerProfileAddress,
            managerProfileAddress
        };
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            if (this.props.currentUser === this.props.manager) {
                console.log(this.state.rating);
                console.log("freelancerAdd", this.props.freelancerProfileAddress);
                await this.props.project.methods.finalizeProjectAsStartup(this.props.freelancerProfileAddress, this.state.rating).send({
                    from: this.props.accounts[0]
                });
            }

            if (this.props.currentUser === this.props.freelancer) {
                console.log(this.state.rating);
                console.log("managerAdd", this.props.managerProfileAddress);
                await this.props.project.methods.finalizeProjectAsFreelancer(this.props.managerProfileAddress, this.state.rating).send({
                    from: this.props.accounts[0]
                });
            }


        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, inputIncomplete: false });
    };

    render() {
        return (
            <Layout>
                <h3>Projekt beenden</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Bewerten Sie die Zusammenarbeit im Projekt</label>
                        <small>* erforderlich</small><br />
                        <small>0 = sehr schlecht, 5 = sehr gut</small>
                        <Input
                            placeholder="1"
                            value={this.state.rating}
                            onChange={event => this.setState({ rating: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header='Fehler!' content={this.state.errorMessage.split('\n')[0]} />
                    <Button loading={this.state.loading} type='submit' content='Projekt abschließen' icon='check' primary />
                </Form>
            </Layout>
        );
    }
}

export default FinalizeProject;
