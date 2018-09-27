import React from 'react';
import { Link } from '../routes';
import { Button, Label, Icon } from 'semantic-ui-react';

const LinkConnector = ({ route, text, button, label, icon, color }) => {
    return (
        <Link route={route}>
            <a>
                {button ? <Button color={color} basic>{text}</Button> : null}
                {label ? <Label><Icon name={icon} /> {text}</Label> : null}
            </a>
        </Link>
    );
};

export default LinkConnector;