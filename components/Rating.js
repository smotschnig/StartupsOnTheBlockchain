import React, { Component } from 'react';
import { Rating } from 'semantic-ui-react';

class RatingStars extends Component {
    state = {
        currentRating: ''
    }

    render() {
        return (
            <div>
                <Rating maxRating={5} clearable onClick={this.state.currentRating} />
                {console.log(this.state.rating)}
            </div>
        );
    }
}

export default RatingStars;