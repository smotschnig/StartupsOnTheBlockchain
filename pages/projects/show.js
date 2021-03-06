import React, { Component } from 'react';
import { Grid, Button, TextArea, Form, Message, Popup } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Project from '../../ethereum/project';
import { Link } from '../../routes';
import { Router } from '../../routes';
import web3 from '../../ethereum/web3';
import LinkConnector from '../../components/LinkConnector';
import ProjectCard from '../../components/ProjectCard';

/**
 * '/projekt/:address'
 * listing details about the project
 * if the project is open (no freelancer chosen), the freelancer can sumit an application
 * if there are applicants, the startup manager can chose one from the applicationpool
 */
class ProjectShow extends Component {
    state = {
        isFreelancer: false,
        isManager: false,
        loading: false,
        cancelLoading: false,
        errorMessage: '',
        errorOccured: false,
    }

    /**
     * getting information about the current project from the smart contract / blockchain
     */
    static async getInitialProps(props) {
        const project = Project(props.query.address);
        const summary = await project.methods.getSummary().call();
        const projectWage = await project.methods.projectWage().call();
        const projectFinalizedByFreelancer = await project.methods.finalizedByFreelancer().call();
        const requesterNumber = await project.methods.requesterCount().call();
        const projectIsOpen = await project.methods.isOpen().call();
        const projectIsFinished = await project.methods.isFinished().call();
        const projectUnderInvestigation = await project.methods.underInvestigation().call();
        const accounts = await web3.eth.getAccounts();
        const visitorAddress = accounts[0];

        let fromLandingPage = true;
        if (props.query.eigenes !== undefined) {
            fromLandingPage = false;
        }

        /**
         * checking if a freelancer has been chosen
         */
        let freelancerChosen = false;
        if (summary[6] !== '0x0000000000000000000000000000000000000000') {
            freelancerChosen = true;
        }

        return {
            address: props.query.address,
            startup: summary[0],
            title: summary[1],
            deadline: summary[2],
            description: summary[3],
            date: summary[4],
            wage: projectWage,
            manager: summary[7],
            chosenFreelancer: summary[6],
            projectIsOpen: projectIsOpen,
            projectIsFinished: projectIsFinished,
            projectUnderInvestigation: projectUnderInvestigation,
            requesterNumber: requesterNumber,
            fromLandingPage: fromLandingPage,
            visitorAddress: visitorAddress,
            freelancerChosen: freelancerChosen,
            projectFinalizedByFreelancer: projectFinalizedByFreelancer
        };
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const project = Project(this.props.url.query.address);
        const summary = await project.methods.getSummary().call();

        /**
         * checking if current user is freelancer
         */
        if (accounts[0] === summary[6]) {
            this.setState({ isFreelancer: true });
        }

        /**
         * checking if current user is project manager
         */
        if (accounts[0] === summary[7]) {
            this.setState({ isManager: true });
        }
    }

    /**
     * calling the component 'ProjectCard' with several props
     */
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

    /**
     * user can call an investigator if something is incorrect with the project 
     */
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

            /**
             * investigator can only called once
             */
            if (projectUnderInvestigation) {
                this.setState({ errorMessage: 'Das Projekt ist bereits gemeldet worden.', errorOccured: true });
            }

            /**
             * if there is no error, the project will be listed as under investigation
             */
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

        this.setState({ loading: false });
    }

    /**
     * manager can cancel the project, the wage of the project gets send back to the project managerAddress
     */
    cancelProject = async () => {
        const {
            projectIsOpen,
            projectUnderInvestigation
        } = this.props;

        this.setState({ cancelLoading: true, errorMessage: '' });
        const project = Project(this.props.url.query.address);
        const accounts = await web3.eth.getAccounts();

        try {

            /**
             * project can not be canceld if a freelancer has been chosen
             */
            if (!projectIsOpen) {
                await this.setState({ errorMessage: 'Das Projekt kann nicht abgebrochen werden, da bereits ein Freelancer zugeteilt worden ist.', errorOccured: true });
            }

            /**
             * project can not be cancled if project is marked as under investigation
             */
            if (projectUnderInvestigation) {
                await this.setState({ errorMessage: 'Das Projekt kann nicht abgebrochen werden, da das Projekt gemeldet worden ist.', errorOccured: true });
            }

            /**
             * if there is no error, the project will be marked as finisehd and canceled 
             * the wage of the project gets send back to the project managerAddress
             */
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

    /**
     * showing different buttons for the user, depending of the project status
     */
    visitorButtons() {
        const {
            address,
            projectIsOpen,
            projectIsFinished,
            requesterNumber,
            freelancerChosen,
            projectUnderInvestigation
        } = this.props;

        const {
            isManager,
            isFreelancer
        } = this.state;

        if (((projectIsOpen || !projectIsFinished) && !isManager) && !isFreelancer) {
            return (
                <div className="interaction_button">
                    {!freelancerChosen && !projectUnderInvestigation
                        ?
                        <Link route={`/projekt/${address}/bewerbung`}>
                            <a><Button color='green' basic>Bewerbung einreichen</Button></a>
                        </Link>
                        :
                        null
                    }
                    <Button disabled>Bewerberpool ({(requesterNumber)})</Button>
                </div>
            );
        }
    }

    /**
     * showing different buttons for the chosen freelancer, depending on the project status
     */
    freelancerButtons() {
        const {
            address,
            projectUnderInvestigation,
            projectFinalizedByFreelancer,
            projectIsFinished
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
                        {!projectUnderInvestigation && !projectFinalizedByFreelancer
                            ?
                            <Link route={`/projekte/${address}/beenden`}>
                                <a><Button color='green' basic>Projekt beenden</Button></a>
                            </Link>
                            :
                            null
                        }
                        {!projectIsFinished ?
                            <Button
                                loading={loading}
                                color="orange"
                                type='submit'
                                content='Problem melden'
                                onClick={() => this.callInvestigator()}
                            />
                            :
                            null
                        }
                    </Form>
                </div>
            );
        }
    }

    /**
     * showing different buttons for the project manager, depending of the project status
     */
    managerButtons() {
        const {
            address,
            requesterNumber,
            freelancerChosen,
            projectUnderInvestigation,
            projectIsFinished
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
                        <Link route={`/projekt/${address}/bewerberpool`}>
                            <a><Button color='green' basic>Bewerberpool ({(requesterNumber)})</Button></a>
                        </Link>
                        {!projectUnderInvestigation && freelancerChosen && !projectIsFinished
                            ?
                            <Link route={`/projekte/${address}/beenden`}>
                                <a><Button color='green' basic>Projekt beenden</Button></a>
                            </Link>
                            :
                            null
                        }
                        {!projectUnderInvestigation && !projectIsFinished ?
                            <Button
                                loading={loading}
                                color="orange"
                                type='submit'
                                content='Problem melden'
                                onClick={() => this.callInvestigator()} />
                            :
                            null
                        }
                        {!projectUnderInvestigation && !projectIsFinished ?
                            <Popup
                                trigger={<Button loading={cancelLoading} negative content='Projekt abbrechen' />}
                                content={<Button color='red' content='Sind Sie sicher?' onClick={() => this.cancelProject()} />}
                                on='click'
                                position='top center'

                            />
                            : null
                        }
                    </Form>
                </div>
            );
        }
    }

    /**
     * showing different messages on the top of the page, depending on the project status
     */
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

        if (projectIsFinished) {
            return (
                <Message info>
                    <Message.Header>Projekt bereits abgeschlossen!</Message.Header>
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
    }

    /**
     * showing serveral cards with information about the project
     */
    render() {
        const {
            description,
            manager,
            fromLandingPage,
            visitorAddress
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
                            {!fromLandingPage ?
                                <Link to={`/projekte/${visitorAddress}`} >
                                    <a><Button size='mini'>Zurück</Button></a>
                                </Link>
                                :
                                <Link to="/">
                                    <a><Button size='mini'>Zurück</Button></a>
                                </Link>
                            }
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
                            <LinkConnector route={`/projekt/${this.props.url.query.address}/${manager}`} text={manager} label={true} icon='address card' />
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