import React from 'react';
import moment from 'moment';

const TimeConverter = ({ date, isCard, showTime }) => {
    const convertedDate = moment.unix(date);

    return (
        <div>
            {isCard && showTime ?
                <div className="member_date">
                    {convertedDate.format("DD.MM.YYYY - HH:MM")}
                </div> :
                <div>
                    {convertedDate.format("DD.MM.YYYY")}
                </div>
            }
        </div>
    );
}

export default TimeConverter;

