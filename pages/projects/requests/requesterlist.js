import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Grid, Button, Form } from 'semantic-ui-react';
import { Link } from '../../../routes';
import { Card, Rating } from 'semantic-ui-react';
import Project from '../../../ethereum/project';
import factory from '../../../ethereum/factory';
import Profile from '../../../ethereum/profile';
import web3 from '../../../ethereum/web3';

class RequesterList extends Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         requesterList: []
    //     }
    // }

    // async componentDidMount() {
    //     const project = Project(this.props.url.query.address);
    //     const addresses = await project.methods.getRequesterList().call();
    //     const requesterList = [];

    //     for (let i = 0; i < addresses.length; i++) {
    //         const profileAddress = await factory.methods.profileDeployedAddress(addresses[i]).call();
    //         const profile = Profile(profileAddress);
    //         console.log(profileAddress);

    //         requesterList.push({
    //             address: addresses[i],
    //             rating:  await profile.methods.rating().call()
    //         });
    //     }


    //     this.setState({ requesterList: requesterList });
    // }

    static async getInitialProps(props) {
        const project = Project(props.query.address);
        const addresses = await project.methods.getRequesterList().call();
        console.log("addresses", addresses);
        let requesterList = [];

        const projectManager = await project.methods.manager().call();
        const accounts = await web3.eth.getAccounts();
        let isManager = false;

        // check if projectManager is current user (MetaMask)
        if (projectManager === accounts[0]) {
            isManager = true;
        }

        for (let i = 0; i < addresses.length; i++) {
            const profileAddress = await factory.methods.profileDeployedAddress(addresses[i]).call();
            const profile = Profile(profileAddress);
            const getApplicantInformation = await project.methods.getApplicantInfo(addresses[i]).call();
            const getProfileInfos = await profile.methods.getInstructor().call();

            console.log(getApplicantInformation);
            console.log(getApplicantInformation[2]);

            let hasBeenChosen = 'false';
            if (getApplicantInformation[2]) {
                hasBeenChosen = 'true';
            }

            requesterList.push({
                address: addresses[i],
                rating: await profile.methods.rating().call(),
                ratingsCounter: await profile.methods.ratingsCounter().call(),
                profile: profileAddress,
                skills: getProfileInfos[5],
                isManager: isManager,
                email: getApplicantInformation[0],
                info: getApplicantInformation[1],
                chosen: hasBeenChosen
            });
        }

        return {
            requesterList
        };
    }

    chooseRequester = async (address) => {
        const project = Project(this.props.url.query.address);
        const accounts = await web3.eth.getAccounts();
        await project.methods
            .chooseRequester(address)
            .send({
                from: accounts[0]
            });
    }

    renderRequesterList() {
        const requester = this.props.requesterList.map(requester => {
            return {
                key: requester.address,
                header: requester.address,
                description:
                    (requester.isManager) ?
                        <div>
                            <p>Skills: {requester.skills}</p>
                            <p>Email: {requester.email}</p>
                            <p>Info: {requester.info}</p>
                            <p>HasBeenChosen: {requester.chosen}</p>
                        </div>
                        : <p>Skills: {requester.skills}</p>,
                meta:
                    (<div>
                        <Rating
                            defaultRating={requester.rating}
                            maxRating={5}
                            disabled
                        /><span>({requester.ratingsCounter})</span>
                    </div>),
                extra:
                    (requester.isManager) ?
                        <div className="requesterlist">
                            <Link
                                route={`/bewerberpool/${requester.address}`}>
                                <a><Button primary type='submit' icon='eye' content='Profil ansehen' /></a>
                            </Link>

                            <Form onSubmit={() => this.chooseRequester(requester.address)}>
                                <Button primary type='submit' icon='add circle' content='Bewerber auswählen' />
                            </Form>
                        </div>
                        : '',
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={requester} itemsPerRow={1} />
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
                <h3>Bewerberpool</h3>
                {this.renderRequesterList()}
            </Layout>
        );
    }
}

export default RequesterList;
