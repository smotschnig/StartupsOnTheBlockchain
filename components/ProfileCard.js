import React from 'react'
import { Card, Icon } from 'semantic-ui-react'

const {
    Content
} = Card;

const ProfileCard = ({ header, extra, icon }) => (
    <Card>
        <Content header={header} />
        <Content extra>
            {icon ? <Icon name={icon} /> : null}
            {extra}
        </Content>
    </Card>
);

export default ProfileCard;