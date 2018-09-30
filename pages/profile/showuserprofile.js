import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Grid, Button, Card } from 'semantic-ui-react';
import ProfileCard from '../../components/ProfileCard';
import factory from '../../ethereum/factory';
import Profile from '../../ethereum/profile';
import Project from '../../ethereum/project';
import { Link } from '../../routes';
import RatingStars from '../../components/RatingStars';
import TimeConverter from '../../components/TimeConverter';

/**
 * '/profil/benutzer'
 * shows profile data from user / manager
 */
class ShowUserProfile extends Component {
    static async getInitialProps(props) {
        const managerAddress = props.query.address;

        /* gets project address from url */
        const projectAddress = props.query.projectaddress;
        let fromApplicantPool = false;

        if (props.query.bewerber === '' || props.query.bewerber === null || props.query.bewerber === undefined) {
            fromApplicantPool = true;
        }

        const project = Project(projectAddress);
        const summary = await project.methods.getSummary().call();
        const profileAddress = await factory.methods.profileDeployedAddress(managerAddress).call();
        const profile = Profile(profileAddress);
        const profileData = await profile.methods.getInstructor().call();
        const memberSince = await profile.methods.date().call();
        const rating = await profile.methods.rating().call();
        const ratingsCounter = await profile.methods.ratingsCounter().call();

        return {
            fName: profileData[0],
            lName: profileData[1],
            birthDate: profileData[2],
            education: profileData[3],
            experience: profileData[4],
            startup: summary[0],
            memberSince: memberSince,
            rating: rating,
            ratingsCounter: ratingsCounter,
            projectAddress: projectAddress,
            fromApplicantPool: fromApplicantPool
        };
    }

    renderProfile() {
        const {
            fName,
            lName,
            birthDate,
            education,
            experience,
            startup,
            memberSince,
            rating,
            ratingsCounter
        } = this.props;

        /**
         * @return two cards in a row with user profile data
         * hides card if user has not filled out
         */
        return (
            <Card.Group itemsPerRow={2}>
                <ProfileCard header={fName + ' ' + lName} extra='Vorname' icon='user' />
                <ProfileCard header={birthDate} extra='Geburtsdatum' icon='calendar' />
                <ProfileCard header={<TimeConverter date={memberSince} isCard={true} showTime={true} />} extra='Mitglied seit' icon='calendar' />
                {startup != '' ? <ProfileCard header={startup} extra='Startup' icon='rocket' /> : null}
                {education != '' ? <ProfileCard header={education} extra='Ausbildung' icon='book' /> : null}
                {experience != '' ? <ProfileCard header={experience} extra='Erfahrung' icon='suitcase' /> : null}
                <ProfileCard header={<div><RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})</div>} extra='Bewertung' icon='star' />
            </Card.Group>
        );
    }

    render() {
        const { fromApplicantPool } = this.props;
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {!fromApplicantPool ?
                                <Link to={`/projekt/${this.props.projectAddress}/bewerberpool`}>
                                    <a>
                                        <Button size='mini'>Zurück</Button>
                                    </a>
                                </Link>
                                :
                                <Link to={`/projekt/${this.props.projectAddress}`}>
                                    <a>
                                        <Button size='mini'>Zurück</Button>
                                    </a>
                                </Link>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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

export default ShowUserProfile;
