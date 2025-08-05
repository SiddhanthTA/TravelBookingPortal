import React, {useState} from 'react';

function flightSearch({onSearch,loading})
{
    const [origin,setOrigin] = useState('');
    const [destination,SetDestination] = useState('');
    const [date,setDate] = useState('');
    const [errors,setErrors] = useState({});

    const validate=()=>{
        const errs={};
        if(!origin) errs.origin='Select origin';
        if(!destination) errs.destination='Select destination';
        if(origin&&destination&&origin===destination)
        errs.same= 'Origin and destination must differ';
        if(!date) errs.date='Pick a date';
        else if(new Date(date)<new Date(new Date().setHours(0,0,0,0)))
        errs.past='Date must not be in past';
        return errs;
    };

    const handleSubmit=()=>{
        const validationErrors=validate();
        if(Object.keys(validationErrors).length>0)
        {
            setErrors(validationErrors);
        }
        else
        {
            setErrors({});
            onSearch(origin,destination,date);
        }
    };

    return(
        <div>
            <label htmlFor="origin">Origin</label>
            <input
            id="origin"
            data-testid="origin-input"
            value={origin}
            onChange={(e)=>setOrigin(e.target.value)}/>
            <label htmlFor="destination">Destination</label>

            <input
            id="destination"
            data-testid="destination-input"
            value={destination}
            onChange={(e)=>SetDestination(e.target.value)}/>
            <label htmlFor="departureDate">Departure Date</label>
            <input 
            id="departureDate"
            data-testid="date-input"
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}/>

            {errors.origin&&<p>{errors.origin}</p>}
            {errors.destination && <p>{errors.destination}</p>}
            {errors.same && <p>{errors.same}</p>}
            {errors.date && <p>{errors.date}</p>}
            {errors.past && <p>{errors.past}</p>}

            <button data-testid="search-button" onClick={handleSubmit} disabled={loading}>
                Search
            </button>
        </div>
    );
}
export default flightSearch;