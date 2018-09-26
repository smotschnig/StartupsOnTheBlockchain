import React from 'react';
import { Rating } from 'semantic-ui-react';

const RatingStars = ({ averageRating }) => <Rating defaultRating={averageRating} maxRating={5} disabled />

export default RatingStars;