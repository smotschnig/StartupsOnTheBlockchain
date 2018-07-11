import React, { Component } from 'react';
import { Card, Grid, Button, TextArea, Form, Label, Icon } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Project from '../../ethereum/project';
import { Link } from '../../routes';

class ProjectShow extends Component {
    static async getInitialProps(props) {
        const project = Project(props.query.address);
        const summary = await project.methods.getSummary().call();

        return {
            address: props.query.address,
            pStartup: summary[0],
            pTitle: summary[1],
            pDeadline: summary[2],
            pDescription: summary[3],
            pWage: summary[4],
            manager: summary[5]
        };
    }

    renderCards() {
        const {
            pStartup,
            pTitle,
            pDeadline,
            pWage
        } = this.props;

        const items = [
            {
                header: pTitle,
                extra: 'Gesuchte Berufsbezeichnung',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: pStartup,
                extra: 'Name des Startup-Unternehmen',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: pDeadline,
                extra: 'Deadline',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: pWage,
                extra: 'Höhe der Vergütung',
                style: { overflowWrap: 'break-word' },
            }
        ];
        return <Card.Group items={items} itemsPerRow={3} />
    }

    render() {
        return (
            <Layout>
                <h3>Project Show</h3>
                {console.log('prop', this.props.pDescription)}
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
                        <Grid.Column width={16}>
                            <Label>
                                <Icon name='address card' />{this.props.manager}
                            </Label>
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