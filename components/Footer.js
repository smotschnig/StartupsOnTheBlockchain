import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'

export default () => {
    return (
        <Segment inverted className="Footer">
            <Menu inverted>
                <Menu.Item position="left" name='Company' className="FooterCopyright">StartupsOnTheBlockchain</Menu.Item>
                <Menu.Item position="right" name='Copyright'>Copyright © 2018 Universität Siegen</Menu.Item>
            </Menu>
        </Segment>
    );
};