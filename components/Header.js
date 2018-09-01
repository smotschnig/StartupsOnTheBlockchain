import React, { Component } from 'react';
import { Grid, Menu, Icon } from 'semantic-ui-react';
import { Link } from '../routes';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Menu className="Header">
                            <Link route="/"><a className="item"><Icon name="chain" />StartupsOnTheBlockchain</a></Link>
                            <Menu.Menu position="right">
                                {this.props.address ? <Link route="/projects/new"><a className="item"><Icon name="plus circle" />New Project</a></Link> : null}
                                <Link route="/information"><a className="item"><Icon name="info circle" />Information</a></Link>
                                {this.props.address ? <Link route={`/profile/${this.props.address}`}><a className="item"><Icon name="user circle" />Profile</a></Link> : null}
                            </Menu.Menu>
                        </Menu>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Header;