import React, { useState } from 'react';

export const INDIAN_CITIES = [
    "Agra","Ahmedabad","Amritsar","Aurangabad","Bengaluru","Bhopal","Bhubaneswar","Chandigarh","Chennai","Coimbatore","Dehradun","Delhi","Goa","Guwahati","Hyderabad","Indore","Jaipur","Jammu","Kochi","Kolkata","Lucknow","Madurai","Mangaluru","Mumbai","Mysuru","Nagpur","Patna","Port Blair","Pune","Raipur","Ranchi","Srinagar","Surat","Thiruvananthapuram","Tiruchirappalli","Udaipur","Varanasi","Visakhapatnam"
];

function FlightSearch({ onSearch, loading }) {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});
    const [suggestionsOpen, setSuggestionsOpen] = useState({});

    const validate = () => {
        const next = {};
        if (!INDIAN_CITIES.includes(origin)) next.origin = 'Choose a departure city from the suggestions.';
        if (destination && !INDIAN_CITIES.includes(destination)) next.destination = 'Choose a destination city from the suggestions.';
        if (origin && destination && origin === destination) next.destination = 'Origin and destination must be different.';
        if (date && date < new Date().toLocaleDateString('en-CA')) next.date = 'Departure date cannot be in the past.';
        return next;
    };
    const submit = (event) => {
        event.preventDefault();
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length) return;
        onSearch(origin, destination, date);
    };
    const cityField = (key, label, value, setValue, placeholder) => {
        const options = INDIAN_CITIES.filter(city => city.toLowerCase().includes(value.toLowerCase()));
        return <div className="field-group flight-city-field">
            <label htmlFor={key}>{label}</label>
            <input id={key} role="combobox" aria-autocomplete="list" aria-expanded={!!suggestionsOpen[key]} autoComplete="off" value={value}
                onFocus={() => setSuggestionsOpen(s => ({...s,[key]:true}))}
                onBlur={() => setTimeout(() => setSuggestionsOpen(s => ({...s,[key]:false})), 120)}
                onChange={e => { setValue(e.target.value); setErrors(s => ({...s,[key]:''})); }}
                placeholder={placeholder} />
            {suggestionsOpen[key] && value && <ul className="city-suggestions">{options.slice(0,8).map(city => <li key={city}><button type="button" onMouseDown={() => {setValue(city);setSuggestionsOpen(s=>({...s,[key]:false}));setErrors(s=>({...s,[key]:''}));}}>{city}</button></li>)}</ul>}
            {errors[key] && <p className="error-text">{errors[key]}</p>}
        </div>;
    };
    return <form className="flight-search-form" onSubmit={submit} noValidate>
        {cityField('origin','From',origin,setOrigin,'Choose departure city')}
        {cityField('destination','To (optional)',destination,setDestination,'Any destination')}
        <div className="field-group"><label htmlFor="departureDate">Departure date (optional)</label>
            <input id="departureDate" type="date" min={new Date().toLocaleDateString('en-CA')} value={date} onChange={e=>{setDate(e.target.value);setErrors(s=>({...s,date:''}));}} />
            {errors.date && <p className="error-text">{errors.date}</p>}</div>
        <button className="search-btn" type="submit" disabled={loading}>{loading?'Searching…':'Search flights'}</button>
    </form>;
}
export default FlightSearch;
