import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from '../routes';

export default () => {
    return (
        <Menu className="Header">
            <Link route="/"><a className="item">StartupsOnTheBlockchain</a></Link>
            <Menu.Menu position="right">
            <Link route="/projects/new"><a className="item">New Project</a></Link>
            <Link route="/profile"><a className="item">Profile</a></Link>
            </Menu.Menu>
        </Menu>
    );
};