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
        const previousPage = window.location.href.split('/');
        const page = previousPage[4];

        const project = Project(page);
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
            page: page
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
                <ProfileCard header={<TimeConverter date={memberSince} isCard={true} />} extra='Mitglied seit' icon='calendar' />
                {startup != '' ? <ProfileCard header={startup} extra='Startup' icon='rocket' /> : null}
                {education != '' ? <ProfileCard header={education} isTextArea={true} extra='Ausbildung' icon='book' /> : null}
                {experience != '' ? <ProfileCard header={experience} isTextArea={true} extra='Erfahrung' icon='suitcase' /> : null}
                <ProfileCard header={<div><RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})</div>} extra='Bewertung' icon='star' />
            </Card.Group>
        );
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Link to={`/projekt/${this.props.page}`}>
                                <a>
                                    <Button size='mini'>Zurück</Button>
                                </a>
                            </Link>
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
