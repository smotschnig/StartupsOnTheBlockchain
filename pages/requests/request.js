import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from '../../routes';

class Request extends Component {
    constructor(props) {
        super(props);

        console.log(props);
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Link to={`/projects/${this.props.url.query.address}`} className="btn btn-light">
                                <a>
                                    <Button size='mini'>Zurück</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <h3>Request</h3>
            </Layout>
        );
    }
}

export default Request;
