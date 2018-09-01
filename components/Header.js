import React, { Component } from 'react';
import { Grid, Menu, Icon } from 'semantic-ui-react';
import { Link } from '../routes';

// import web3 from '../ethereum/web3';

class Header extends Component {

    constructor(props) {
        super(props);
    }

    renderNewProjectButton() {
        if(this.props.address) {
            return (
                <Link route="/projects/new">
                    <a className="item"><Icon name="plus circle" />New Project</a>
                </Link>
            ); 
        }
        return null;
    }

    renderProfileButton() {
        if(this.props.address) {
            return (
                <Link route={`/profile/${this.props.address}`}>
                    <a className="item"><Icon name="user circle" />Profile</a>
                </Link>
            );
        }
        return null;
    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Menu className="Header">
                            <Link route="/"><a className="item"><Icon name="chain" />StartupsOnTheBlockchain</a></Link>
                            <Menu.Menu position="right">
                                {this.renderNewProjectButton()}
                                <Link route="/information"><a className="item"><Icon name="info circle" />Information</a></Link>
                                {this.renderProfileButton()}
                            </Menu.Menu>
                        </Menu>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Header;