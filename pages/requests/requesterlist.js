import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from '../../routes';
import Project from '../../ethereum/project';
import { Card } from 'semantic-ui-react';

class RequesterList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requesterList: []
        }
    }

    async componentDidMount() {
        const project = Project(this.props.url.query.address);
        const requesterList = await project.methods.getRequesterList().call();
        this.setState({ requesterList: requesterList });
    }

    renderRequesterList() {
        const requester = this.state.requesterList.slice(0).map(requester => {
            const req = requester
            return {
                key: req,
                header: req,
                meta: 'Horst',
                style: { overflowWrap: 'break-word' }
            };
        });
        return <Card.Group items={requester} />
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Link to={`/projects/${this.props.url.query.address}`}>
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
