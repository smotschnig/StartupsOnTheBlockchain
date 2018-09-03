import React, { Component } from 'react';
import { Card, Grid, Button, TextArea, Form, Label, Icon, Rating } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Project from '../../ethereum/project';
import { Link } from '../../routes';
import moment from 'moment';

class ProjectShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: 'asd',
            startup: 'bse',
            title: 'eee',
            deadline: '',
            Description: '',
            wage: '',
            date: '',
            manager: '',
            requesterNumber: ''
        }
    }

    async componentDidMount() {
        const project = Project(this.props.url.query.address);
        const summary = await project.methods.getSummary().call();
        const requesterNumber = await project.methods.requesterCount().call();
        this.setState({
            address: this.props.url.query.address,
            startup: summary[0],
            title: summary[1],
            deadline: summary[2],
            description: summary[3],
            wage: summary[4],
            date: summary[5],
            manager: summary[6],
            requesterNumber: requesterNumber
        });
    }

    timeConverter(timestamp) {
        var date = moment.unix(timestamp);
        return date.format("DD.MM.YYYY - HH:mm");
    }

    renderCards() {
        const {
            startup,
            title,
            deadline,
            wage,
            date
        } = this.state;

        const convertedDate = this.timeConverter(date);

        const items = [
            {
                header: title,
                extra: 'Gesuchte Berufsbezeichnung',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: startup,
                extra: 'Name des Startups',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: deadline,
                extra: 'Deadline',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: wage,
                extra: 'Höhe der Vergütung',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: convertedDate,
                extra: 'Einstellungsdatum',
                style: { overflowWrap: 'break-word' },
            }
        ];
        return <Card.Group items={items} itemsPerRow={3} />
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Link to="/">
                                <a>
                                    <Button size='mini'>Zurück</Button>
                                </a>
                            </Link>
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
                                <TextArea readOnly disabled autoHeight defaultValue={this.state.description} />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Label>
                                <Icon name='address card' />
                                <Link route={`/profil/benutzer/${this.state.manager}`}>
                                    <a>
                                        {this.state.manager}
                                    </a>
                                </Link>
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/projekt/${this.state.address}/bewerbung`}>
                                <a>
                                    <Button primary>Bewerbung einreichen</Button>
                                </a>
                            </Link>
                            <Link route={`/projekt/${this.state.address}/bewerberpool`}>
                                <a>
                                    <Button primary>Bewerberpool ({(this.state.requesterNumber)})</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ProjectShow;