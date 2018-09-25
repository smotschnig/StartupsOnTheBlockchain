import React from 'react';
import { Rating } from 'semantic-ui-react';

const RatingStars = (props) => <Rating defaultRating={props.averageRating} maxRating={5} disabled />

export default RatingStars;