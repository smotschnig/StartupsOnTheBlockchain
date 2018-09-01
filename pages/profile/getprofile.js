import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Profile from '../../ethereum/profile';
import { Card, Grid } from 'semantic-ui-react';

class GetProfile extends Component {
    static async getInitialProps(props) {
        console.log('props', props);

        const profileAddress = props.query.address
        const profile = Profile(profileAddress);
        // const profileData = await profile.methods.getInstructor().call();

        return {
            // fName: profileData[0],
            // lName: profileData[1],
            // birthDate: profileData[2],
            // education: profileData[3],
            // experience: profileData[4],
            // skills: profileData[5]
        };
    }

    renderProfile() {
        const items = [
            {
                header: this.props.fName,
                extra: 'Vorname',
                style: { overflowWrap: 'break-word' }
            }
        ]
        return <Card.Group items={items} itemsPerRow={3} />
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <p>Bla</p>
                            {/* <p>{this.renderProfile()}</p> */}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default GetProfile;
