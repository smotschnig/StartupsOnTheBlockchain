import React from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

const renderLoading = () => (
    <Segment>
        <Dimmer active inverted>
            <Loader />das ist ein test.
        </Dimmer>
    </Segment>
);

export default renderLoading;