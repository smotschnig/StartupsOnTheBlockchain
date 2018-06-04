import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from '../routes';

export default () => {
    return (
        <Menu className="Header">
            <Link route="/"><a className="item">StartupsOnTheBlockchain</a></Link>
            <Menu.Menu position="right">
            <Link route="/"><a className="item">Projects</a></Link>
            <Link route="/projects/new"><a className="item">+</a></Link>
            </Menu.Menu>
        </Menu>
    );
};