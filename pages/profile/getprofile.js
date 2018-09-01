import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Profile from '../../ethereum/profile';
import { Card, Grid } from 'semantic-ui-react';

class GetProfile extends Component {
    static async getInitialProps(props) {
        console.log('props', props);

        const profileAddress = props.query.address
        const profile = Profile(profileAddress);
        const profileData = await profile.methods.getInstructor().call();

        return {};
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <p></p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default GetProfile;
