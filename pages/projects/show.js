import React, { Component } from 'react';
import { Grid, Button, TextArea, Form, Message, Popup } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Project from '../../ethereum/project';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';
import LinkConnector from '../../components/LinkConnector';
import ProjectCard from '../../components/ProjectCard';

/**
 * '/projekt/:address'
 * listing details about the project
 * if the project is open (no freelancer chosen), the freelancer can sumit an application
 * if there are applicants, the startup-manager can chose one from a applicationpool
 */
class ProjectShow extends Component {
    state = {
        address: undefined,
        isFreelancer: false,
        isManager: false,
        loading: false,
        cancelLoading: false,
        errorMessage: '',
        errorOccured: false
    }

    static async getInitialProps(props) {
        const project = Project(props.query.address);
        const summary = await project.methods.getSummary().call();
        const requesterNumber = await project.methods.requesterCount().call();
        const projectIsOpen = await project.methods.isOpen().call();
        const projectIsFinished = await project.methods.isFinished().call();
        const projectUnderInvestigation = await project.methods.underInvestigation().call();

        return {
            address: props.query.address,
            startup: summary[0],
            title: summary[1],
            deadline: summary[2],
            description: summary[3],
            date: summary[4],
            wage: summary[5],
            manager: summary[7],
            chosenFreelancer: summary[6],
            projectIsOpen: projectIsOpen,
            projectIsFinished: projectIsFinished,
            projectUnderInvestigation: projectUnderInvestigation,
            requesterNumber: requesterNumber
        };
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const project = Project(this.props.url.query.address);
        const projectManager = await project.methods.getSummary().call();

        if (accounts[0] === projectManager[6]) {
            this.setState({ isFreelancer: true });
        }

        if (accounts[0] === projectManager[7]) {
            this.setState({ isManager: true });
        }
    }

    renderCards() {
        const {
            startup,
            title,
            deadline,
            wage,
            date
        } = this.props;

        const validatedDeadline = (deadline === '') ? 'keine Angabe' : deadline;

        return (
            <ProjectCard
                startup={startup}
                title={title}
                deadline={validatedDeadline}
                wage={wage}
                date={date}
            />
        );
    }

    callInvestigator = async () => {
        const {
            projectUnderInvestigation
        } = this.props;

        const {
            errorMessage,
            loading
        } = this.state;

        this.setState({ loading: true, errorMessage: '' });
        const project = Project(this.props.url.query.address);
        const accounts = await web3.eth.getAccounts();

        try {
            if (projectUnderInvestigation) {
                this.setState({ errorMessage: 'Das Projekt ist bereits gemeldet worden.', errorOccured: true });
            }

            if (!this.state.errorOccured) {
                await project.methods.callInvestigator()
                    .send({
                        from: accounts[0]
                    });
                Router.pushRoute('/');
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false, errorOccured: false });
    }

    cancelProject = async () => {
        const {
            projectIsOpen,
            projectUnderInvestigation
        } = this.props;

        this.setState({ cancelLoading: true, errorMessage: '' });
        const project = Project(this.props.url.query.address);
        const accounts = await web3.eth.getAccounts();

        try {
            if (!projectIsOpen) {
                await this.setState({ errorMessage: 'Das Projekt kann nicht abgebrochen werden, da bereits ein Freelancer zugeteilt worden ist.', errorOccured: true });
            }

            if (projectUnderInvestigation) {
                await this.setState({ errorMessage: 'Das Projekt kann nicht abgebrochen werden, da das Projekt gemeldet worden ist.', errorOccured: true });
            }

            if (!this.state.errorOccured) {
                await project.methods.cancelProject()
                    .send({
                        from: accounts[0]
                    });
                Router.pushRoute('/');
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ cancelLoading: false, errorOccured: false });
    }

    visitorButtons() {
        const {
            address,
            projectIsOpen,
            projectIsFinished,
            requesterNumber,
        } = this.props;

        const {
            isManager,
            isFreelancer
        } = this.state;

        if (((projectIsOpen || !projectIsFinished) && !isManager) && !isFreelancer) {
            return (
                <div className="interaction_button">
                    <Link route={`/projekt/${address}/bewerbung`}>
                        <a><Button primary>Bewerbung einreichen</Button></a>
                    </Link>
                    <Link route={`/projekt/${address}/bewerberpool`}>
                        <a><Button primary>Bewerberpool ({(requesterNumber)})</Button></a>
                    </Link>
                </div>
            );
        }
    }

    freelancerButtons() {
        const {
            address
        } = this.props;

        const {
            loading,
            isFreelancer,
            errorMessage
        } = this.state;

        if (isFreelancer) {
            return (
                <div className="interaction_button">
                    <Form error={!!errorMessage}>
                        <Message error content={errorMessage.split('\n')[0]} />
                        <Link route={`/projekt/${address}/beenden`}>
                            <a><Button color='green' basic>Projekt beenden</Button></a>
                        </Link>
                        <Button
                            loading={loading}
                            color="orange"
                            type='submit'
                            content='Problem melden'
                            onClick={() => this.callInvestigator()}
                        />
                    </Form>
                </div>
            );
        }
    }

    managerButtons() {
        const {
            address
        } = this.props;

        const {
            loading,
            cancelLoading,
            isManager,
            errorMessage
        } = this.state;

        if (isManager) {
            return (
                <div className="interaction_button">
                    <Form error={!!errorMessage}>
                        <Message error content={errorMessage.split('\n')[0]} />
                        <Link route={`/projekt/${address}/beenden`}>
                            <a><Button color='green' basic>Projekt beenden</Button></a>
                        </Link>
                        <Button
                            loading={loading}
                            color="orange"
                            type='submit'
                            content='Problem melden'
                            onClick={() => this.callInvestigator()} />
                        <Popup
                            trigger={<Button loading={cancelLoading} negative content='Projekt abbrechen' />}
                            content={<Button color='red' content='Sind Sie sicher?' onClick={() => this.cancelProject()} error={!!errorMessage} />}
                            on='click'
                            position='top center'
                        />
                    </Form>
                </div>
            );
        }
    }

    callMessage() {
        const {
            projectUnderInvestigation,
            projectIsOpen,
            projectIsFinished,
            chosenFreelancer
        } = this.props;

        if (projectUnderInvestigation) {
            return (
                <Message negative>
                    <Message.Header>Projekt wurde gemeldet!</Message.Header>
                </Message>
            );
        }

        if (!projectIsOpen) {
            return (
                <Message info>
                    <Message.Header>Projekt bereits vergeben!</Message.Header>
                    <p>Freelancer: {chosenFreelancer}</p>
                </Message>
            );
        }

        if (projectIsFinished) {
            return (
                <Message info>
                    <Message.Header>Projekt bereits abgeschlossen!</Message.Header>
                </Message>
            );
        }
    }

    render() {
        const {
            description,
            manager
        } = this.props;

        const {
            isFreelancer
        } = this.state;

        return (
            <Layout>
                {this.callMessage()}
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Link to="/">
                                <a><Button size='mini'>Zurück</Button></a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <h3>Projektdetails</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {this.renderCards()}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <h4>Projektbeschreibung:</h4>
                            <Form>
                                <TextArea
                                    readOnly
                                    disabled
                                    autoHeight
                                    defaultValue={(description === '') ? 'keine Angabe' : description}
                                />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <LinkConnector route={`/profil/benutzer/${manager}`} text={manager} label={true} icon='address card' />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.visitorButtons()}
                            {this.freelancerButtons()}
                            {this.managerButtons()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ProjectShow;