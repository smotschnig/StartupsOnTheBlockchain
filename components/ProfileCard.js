import React from 'react'
import { Card, Icon, Form, TextArea } from 'semantic-ui-react'

const {
    Content
} = Card;

const ProfileCard = ({ header, extra, icon, isTextArea }) => (
    <Card>
        {!isTextArea ?
            <Content header={header} /> :
            <div className="text_card">
                <Form>
                    <TextArea
                        readOnly
                        disabled
                        autoHeight
                        defaultValue={header}
                    />
                </Form>
            </div>
        }
        <Content extra>
            {icon ? <Icon name={icon} /> : null}
            {extra}
        </Content>

    </Card>

);

export default ProfileCard;