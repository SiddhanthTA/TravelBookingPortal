import React, {useState} from 'react';

function HotelSearch({onSearch, loading})
{
    const [location,setLocation] = useState('');
    const [minRating,setMinRating] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [errors, setErrors]=useState({});

    const validate=()=>
    {
        const errs={};
        if(!location) errs.location='Select location';
        if(maxPrice && parseFloat(maxPrice)<0)
        errs.price='Price should be positive';
        return errs; 
    };

    const handleSearch=()=>
    {
        const validationErrors=validate();
        if(Object.keys(validationErrors).length>0)
        {
            setErrors(validationErrors);
        }
        else
        {
            setErrors({});
            onSearch(location,parseInt(minRating||0),parseFloat(maxPrice || 0));
        }
    };

    return(
        <div>
            <label htmlFor="location">Location</label>
            <input
            id="location"
            data-testid="location-input"
            value={location}
            onChange={(e)=>setLocation(e.target.value)}/>

            <label htmlFor="minRating">Minimum Rating</label>
            <input
            id="minRating"
            data-testid="min-rating-input"
            type="number"
            value={minRating}
            onChange={(e)=>setMinRating(e.target.value)}/>

            <label htmlFor="maxPrice">Maximum Price Per night</label>
            <input 
            id="maxPrice"
            data-testid="max-price-input"
            type="number"
            value={maxPrice}
            onChange={(e)=>setMaxPrice(e.target.value)}/>

            {errors.location && <p>{errors.location}</p>}
            {errors.price && <p>{errors.price}</p>}

            <button data-testid="search-hotel-btn" onClick={handleSearch} disabled={loading}>
                Search
            </button>
            </div>
    );
}
export default HotelSearch;