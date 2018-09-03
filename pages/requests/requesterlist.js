import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from '../../routes';
import Project from '../../ethereum/project';

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
                <p>{this.state.requesterList}</p>
            </Layout>
        );
    }
}

export default RequesterList;
