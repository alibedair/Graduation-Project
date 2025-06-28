const validateAuctionStartDate = (value) => {
    if (typeof value !== 'object' || !value.date || !value.time) {
        throw new Error('Start date must be an object with date and time properties: { "date": "YYYY-MM-DD", "time": "HH:MM" }');
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value.date)) {
        throw new Error('Date must be in YYYY-MM-DD format');
    }
    
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(value.time)) {
        throw new Error('Time must be in HH:MM format (24-hour)');
    }
    const combinedDateTime = new Date(`${value.date}T${value.time}:00`);
    if (isNaN(combinedDateTime.getTime())) {
        throw new Error('Invalid date/time combination');
    }
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    
    if (combinedDateTime < oneYearAgo) {
        throw new Error('Date cannot be more than one year in the past');
    }
    
    if (combinedDateTime > oneYearFromNow) {
        throw new Error('Date cannot be more than one year in the future');
    }
    
    return true;
};

const validateFutureDateTime = (dateTimeObj) => {
    if (!dateTimeObj || !dateTimeObj.date || !dateTimeObj.time) {
        return false;
    }
    
    const combinedDateTime = new Date(`${dateTimeObj.date}T${dateTimeObj.time}:00`);
    const now = new Date();
    
    return combinedDateTime > now;
};

const convertToDateTime = (dateTimeObj) => {
    if (!dateTimeObj || !dateTimeObj.date || !dateTimeObj.time) {
        throw new Error('Invalid date/time object');
    }
    
    return new Date(`${dateTimeObj.date}T${dateTimeObj.time}:00`);
};

const formatToLocaleString = (date) => {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

module.exports = {
    validateAuctionStartDate,
    validateFutureDateTime,
    convertToDateTime,
    formatToLocaleString
};
