import React from 'react'
import { Card } from 'semantic-ui-react';
import TimeConverter from './TimeConverter';
import web3 from '../ethereum/web3';

const {
    Content,
    Group
} = Card;

const ProjectCard = ({ startup, title, deadline, wage, date }) => (
    <Group itemsPerRow={3}>
        <Card>
            <Content header={title} />
            <Content extra>
                Gesuchte Berufsbezeichnung
        </Content>
        </Card>

        <Card>
            <Content header={startup} />
            <Content extra>
                Name des Startups
        </Content>
        </Card>

        <Card>
            <Content header={deadline} />
            <Content extra>
                Deadline
        </Content>
        </Card>

        <Card>
            <Content header={web3.utils.fromWei(wage, 'ether') + ' (ETH)'} />
            <Content extra>
                Höhe der Vergütung
        </Content>
        </Card>

        <Card>
            <Content header={<TimeConverter date={date} isCard={true} showTime={true} />} />
            <Content extra>
                Einstellungsdatum
        </Content>
        </Card>
    </Group>
);

export default ProjectCard;