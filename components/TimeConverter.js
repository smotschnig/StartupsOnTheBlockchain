import React from 'react';
import moment from 'moment';

const TimeConverter = ({ date, isCard }) => {
    const convertedDate = moment.unix(date);

    return (
        <div>
            {isCard ?
                <div className="member_date">
                    {convertedDate.format("DD.MM.YYYY")}
                </div> :
                <div>
                    {convertedDate.format("DD.MM.YYYY")}
                </div>
            }
        </div>
    );
}

export default TimeConverter;

