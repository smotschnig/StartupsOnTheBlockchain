import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Card, Grid } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Profile from '../../ethereum/profile';

class GetProfile extends Component {
    static async getInitialProps(props) {
        const managerAddress = props.query.address
        const profileAddress = await factory.methods.profileDeployedAddress(managerAddress).call();
        const profile = Profile(profileAddress);
        const profileData = await profile.methods.getInstructor().call();

        return {
            fName: profileData[0],
            lName: profileData[1],
            birthDate: profileData[2],
            education: profileData[3],
            experience: profileData[4],
            skills: profileData[5]
        };
    }

    renderProfile() {
        const items = [
            {
                header: this.props.fName,
                extra: 'Vorname',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.lName,
                extra: 'Nachname',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.birthDate,
                extra: 'birthDate',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.education,
                extra: 'Education',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.experience,
                extra: 'Experience',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.skills,
                extra: 'Skills',
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
                            {this.renderProfile()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default GetProfile;
