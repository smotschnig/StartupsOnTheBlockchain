import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Grid, Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Project from '../../../ethereum/project';
import factory from '../../../ethereum/factory';
import Profile from '../../../ethereum/profile';
import RequesterRow from '../../../components/RequesterRow';
import web3 from '../../../ethereum/web3';

/**
 * '/projekt/:address/bebwerberpool'
 * listing all applicants for the current project
 * shows more information if user == project manager
 */
class RequesterList extends Component {
    state = {
        isManager: false,
        hasRequester: false,
        projectIsOpen: true
    }

    /**
     * getting all applicants for the current project from smart contract / blockchain
     */
    static async getInitialProps(props) {
        const project = Project(props.query.address);
        const addresses = await project.methods.getRequesterList().call();
        let requesterList = [];

        for (let i = 0; i < addresses.length; i++) {
            const profileAddress = await factory.methods.profileDeployedAddress(addresses[i]).call();
            const profile = Profile(profileAddress);
            const getApplicantInformation = await project.methods.getApplicantInfo(addresses[i]).call();

            requesterList.push({
                address: addresses[i],
                rating: await profile.methods.rating().call(),
                ratingsCounter: await profile.methods.ratingsCounter().call(),
                profile: profileAddress,
                email: getApplicantInformation[0],
                info: getApplicantInformation[1],
                project: project
            });
        }

        return {
            requesterList
        };
    }

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const project = Project(this.props.url.query.address);
        const projectManager = await project.methods.manager().call();
        const addresses = await project.methods.getRequesterList().call();

        /**
         * checking if project is open (freelancer has not been chosen yet)
         */
        if (!await project.methods.isOpen().call()) {
            this.setState({ projectIsOpen: false });
        }

        /**
         * checking if there are any applicants
         */
        if (addresses.length !== 0) {
            this.setState({ hasRequester: true });
        }

        /**
        * checking if user is project manager
        */
        if (accounts[0] === projectManager) {
            this.setState({ isManager: true });
        }
    }

    /**
     * calling the component 'RequesterRow' with several props as project manager
     */
    renderManagerRows() {
        return this.props.requesterList.slice(0).reverse().map((applicant, index) => {
            const {
                address,
                rating,
                ratingsCounter,
                profile,
                email,
                info,
                project
            } = applicant;

            const {
                isManager,
                projectIsOpen
            } = this.state;

            return (
                <RequesterRow
                    key={index}
                    address={address}
                    rating={rating}
                    ratingsCounter={ratingsCounter}
                    isManager={isManager}
                    profile={profile}
                    email={email}
                    info={info}
                    project={project}
                    projectAddress={this.props.url.query.address}
                    projectIsOpen={projectIsOpen}
                />
            );
        });
    }

    /**
     * showing all requester in form of a table
     * if project manager, there are a few more details 
     * if project manager, applicant for project can be chosen
     */
    render() {
        const {
            Header,
            Row,
            HeaderCell
        } = Table;

        const { isManager, hasRequester } = this.state;

        const { url } = this.props;

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
                <h3>Bewerberpool</h3>
                {hasRequester ?
                    <Table>
                        <Header>
                            <Row>
                                <HeaderCell>Bewerber</HeaderCell>
                                <HeaderCell>Bewertung</HeaderCell>
                                <HeaderCell>Email</HeaderCell>
                                <HeaderCell>Info</HeaderCell>
                                <HeaderCell>Details</HeaderCell>
                            </Row>
                        </Header>
                        {this.renderManagerRows()}
                    </Table>
                    :
                    <p>Es liegt noch keine Bewerbung vor.</p>
                }
            </Layout>
        );
    }
}

export default RequesterList;
