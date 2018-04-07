import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'

export default () => {
    return (
        <Segment inverted style={{ marginTop: '20px', padding: '2px' }}>
            <Menu inverted>
                <Menu.Item position="left" name='Company' style={{ fontSize: '105%', fontWeight: 'bold' }}>StartupOnTheChain</Menu.Item>
                <Menu.Item position="right" name='Copyright'>Copyright © 2018 Universität Siegen</Menu.Item>
            </Menu>
        </Segment>
    )
};