import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Project from '../../../ethereum/project';
import factory from '../../../ethereum/factory';
import Profile from '../../../ethereum/profile';
import { Card, Rating } from 'semantic-ui-react';

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
        let requesterList = [];

        for (let i = 0; i < addresses.length; i++) {
            const profileAddress = await factory.methods.profileDeployedAddress(addresses[i]).call();
            const profile = Profile(profileAddress);

            requesterList.push({
                address: addresses[i],
                rating: await profile.methods.rating().call(),
                ratingsCounter: await profile.methods.ratingsCounter().call(),
            });
        }

        return {
            requesterList
        };
    }

    renderRequesterList() {
        const requester = this.props.requesterList.map(requester => {
            const rating = <Rating defaultRating={requester.rating} maxRating={5} disabled />
            return {
                key: requester.address,
                header: requester.address,
                meta:
                    (<Rating
                        defaultRating={requester.rating}
                        maxRating={5}
                        disabled
                    />),
                extra:
                    (<Link
                        route={`/projekt/`}>
                        <a>Bewerberprofil ansehen</a>
                    </Link>),
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
