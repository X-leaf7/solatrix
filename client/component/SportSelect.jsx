import React, { useState } from 'react'
import { GET_SPORTS } from '/context/AppUrl'

function SportSelect({selected, setSelected}) {

    const [getSports, setSports] = useState(null);

    React.useEffect(async () => {
        await fetch(GET_SPORTS)
            .then(data => data.json())
            .then(setSports)
            .catch(err => {
                setSports([])
            })

    }, [])

    const handleChange = event => {
        setSelected(event.target.value);
    }

    return (
        getSports &&
       
        <select className="custom" defaultValue="" value={selected} onChange={handleChange}>
            <option value="">Filter by Sport</option>
            {getSports.map(sport => (
              <option key={sport.slug} value={sport.id}>
                {sport.name}
              </option>
            ))}
        </select>
    )
}

export default SportSelect