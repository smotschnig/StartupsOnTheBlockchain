import React from 'react';
import { Menu, Segment, Icon } from 'semantic-ui-react';

export default () => {
    return (
        <Segment inverted className="Footer">
            <Menu inverted>
                <Menu.Item position="left" name="Company" className="CopyrightStartup"><Icon name="chain" />StartupsOnTheBlockchain</Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item>Copyright © 2018 Universität Siegen</Menu.Item>
                </Menu.Menu>
            </Menu>
        </Segment>
    );
};