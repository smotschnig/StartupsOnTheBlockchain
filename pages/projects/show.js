import React, { Component } from 'react';
import { Card, Grid, Button, TextArea, Form, Label, Icon, Rating } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Project from '../../ethereum/project';
import Profile from '../../ethereum/profile';
import { Link } from '../../routes';
import moment from 'moment';

class ProjectShow extends Component {
    static async getInitialProps(props) {
        const project = Project(props.query.address);

        const summary = await project.methods.getSummary().call();

        return {
            address: props.query.address,
            Startup: summary[0],
            Title: summary[1],
            Deadline: summary[2],
            Description: summary[3],
            Wage: summary[4],
            Date: summary[5],
            manager: summary[6]
        };
    }

    timeConverter(timestamp) {
        var date = moment.unix(timestamp);
        return date.format("DD.MM.YYYY - HH:mm:ss");
    }

    renderCards() {
        const {
            Startup,
            Title,
            Deadline,
            Wage,
            Date
        } = this.props;

        const convertedDate = this.timeConverter(Date);

        const items = [
            {
                header: Title,
                extra: 'Gesuchte Berufsbezeichnung',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: Startup,
                extra: 'Name des Startup-Unternehmen',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: Deadline,
                extra: 'Deadline',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: Wage,
                extra: 'Höhe der Vergütung',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: convertedDate,
                extra: 'Datum der Erzeugung',
                style: { overflowWrap: 'break-word' },
            }
        ];
        return <Card.Group items={items} itemsPerRow={3} />
    }

    render() {
        return (
            <Layout>
                <h3>Project Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {this.renderCards()}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <h4>Aufgabenbeschreibung:</h4>
                            <Form>
                                <TextArea readOnly disabled autoHeight defaultValue={this.props.pDescription} />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Label>
                                <Icon name='address card' />{this.props.manager}
                            </Label>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Rating icon='star' defaultRating={3} maxRating={5} disabled size='small' /> ({this.props.pWage})
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/projects/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>Apply for Project</Button>
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