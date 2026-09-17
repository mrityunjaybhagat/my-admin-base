import React from 'react';

const formatDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate().toString().padStart(2, '0'); // Ensures two-digit day
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2); // Last two digits of the year
    return `${day}-${month}-${year}`;
};

const TodayDate = () => {
    const today = new Date();
    const formattedDate = formatDate(today);

    return <div>{formattedDate}</div>;
};

export default TodayDate;
