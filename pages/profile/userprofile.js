import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router } from '../../routes';
import web3 from '../../ethereum/web3';
import { DateInput } from 'semantic-ui-calendar-react';
import factory from '../../ethereum/factory';
import Profile from '../../ethereum/profile';
import RatingStars from '../../components/RatingStars';

/**
 * '/profil'
 * user or manager can create and / or update a profile
 */
class UserProfile extends Component {
    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const profileExists = await factory.methods.profileAlreadyExists(accounts[0]).call();

        if (profileExists) {
            this.setState({ showUpdateFeatures: true, showCreateButton: false });

            const profileAddress = await factory.methods.profileDeployedAddress(accounts[0]).call();
            const profile = Profile(profileAddress);
            const profileData = await profile.methods.getInstructor().call();
            const rating = await profile.methods.rating().call();
            const ratingsCounter = await profile.methods.ratingsCounter().call();

            this.setState({
                fName: profileData[0],
                lName: profileData[1],
                birthDate: profileData[2],
                education: profileData[3],
                experience: profileData[4],
                rating: rating,
                ratingsCounter: ratingsCounter
            });
        } else {
            this.setState({ showUpdateFeatures: false, showCreateButton: true });
        }
    }

    state = {
        fName: '',
        lName: '',
        birthDate: '',
        education: '',
        experience: '',
        errorMessage: '',
        loading: false,
        showCreateButton: false,
        showUpdateFeatures: false,
        inputIncomplete: false
    };

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            const profileExists = await factory.methods.profileAlreadyExists(accounts[0]).call();

            if (this.state.fName === '' || this.state.lName === '' || this.state.birthDate === '') {
                this.setState({ inputIncomplete: true, errorMessage: 'Eingaben unvollständig.' });
            }

            if (!profileExists && !this.state.inputIncomplete) {
                await factory.methods
                    .createProfile(this.state.fName, this.state.lName, this.state.birthDate, this.state.education, this.state.experience)
                    .send({
                        from: accounts[0]
                    });
                Router.pushRoute('/');
            }

            if (profileExists && !this.state.inputIncomplete) {
                const profileAddress = await factory.methods.profileDeployedAddress(accounts[0]).call();
                const profile = Profile(profileAddress);
                await profile.methods.setInstructor(this.state.fName, this.state.lName, this.state.birthDate, this.state.education, this.state.experience)
                    .send({
                        from: accounts[0]
                    });
                Router.pushRoute('/');
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false, inputIncomplete: false });
    };

    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }

    render() {
        const { Field } = Form;
        const {
            fName,
            lName,
            birthDate,
            education,
            experience,
            rating,
            ratingsCounter,
            showCreateButton,
            showUpdateFeatures,
            loading,
            errorMessage
        } = this.state;

        return (
            <Layout>
                <h3>Benutzerprofil</h3>
                <Form onSubmit={this.onSubmit} error={!!errorMessage}>
                    <Field>
                        <label>Vorname</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder="John"
                            value={fName}
                            onChange={event => this.setState({ fName: event.target.value })}
                        />
                    </Field>
                    <Field>
                        <label>Nachname</label>
                        <small>* erforderlich</small>
                        <Input
                            placeholder='Doe'
                            value={lName}
                            onChange={event => this.setState({ lName: event.target.value })}
                        />
                    </Field>
                    <Field>
                        <label>Geburtstdatum</label>
                        <small>* erforderlich</small><br />
                        <small>DD.MM.YYYY</small>
                        <DateInput
                            name="birthDate"
                            placeholder="Date"
                            value={birthDate}
                            iconPosition="left"
                            onChange={this.handleChange}
                            dateFormat="DD.MM.YYYY"
                        />
                    </Field>
                    <Field>
                        <label>Ausbildungsinformationen</label>
                        <textarea
                            placeholder="Schule, Ausbildung, Studium, etc."
                            value={education}
                            onChange={event => this.setState({ education: event.target.value })}
                        />
                    </Field>
                    <Field>
                        <label>Sonstige Erfahrungen</label>
                        <textarea
                            placeholder="Zertifikate, Weiterbildungen, Online-Kurse, Fähigkeiten, etc. "
                            value={experience}
                            onChange={event => this.setState({ experience: event.target.value })}
                        />
                    </Field>
                    {showUpdateFeatures ?
                        <Field>
                            <label>Aktuelle Bewertung</label>
                            {
                                <div>
                                    <RatingStars averageRating={Math.floor(rating / ratingsCounter)} /> ({ratingsCounter})
                                </div>
                            }
                        </Field> : null}
                    <Message error header='Fehler!' content={errorMessage.split('\n')[0]} />
                    {showCreateButton ? <Button loading={loading} type='submit' content='Create Account' icon='check' primary /> : null}
                    {showUpdateFeatures ? <Button loading={loading} type='submit' content='Update' icon='check' primary /> : null}
                </Form>
            </Layout>
        );
    }
}

export default UserProfile;