import React from 'react'
import { Grid, Menu, Icon } from 'semantic-ui-react'
import { Link } from '../routes';

export default () => {
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Menu className="Header">
                        <Link route="/"><a className="item"><Icon name="chain" />StartupsOnTheBlockchain</a></Link>
                        <Menu.Menu position="right">
                            <Link route="/projects/new"><a className="item"><Icon name="plus circle" />New Project</a></Link>
                            <Link route="/information"><a className="item"><Icon name="info circle" />Information</a></Link>
                            <Link route="/profile"><a className="item"><Icon name="user circle" />Profile</a></Link>
                        </Menu.Menu>
                    </Menu>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};