import React, { useEffect, useState, useContext } from 'react'
import AppContext from "../context/AppContext";
import Router, { useRouter } from 'next/router';
import Link from 'next/link';

    
function Search() {
    const { setSearch, search, event } = useContext(AppContext);
    const [searchList, setSearchList] = useState(false);

    const [homeFilter, setHomeFilter] = useState(null);
    const [awayFilter, setAwayFilter] = useState(null);
    const [hostFilter, setHostFilter] = useState(null);
    const router = useRouter();
    

    const handleChange = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }



    useEffect(() => {
        if (search.length > 0) {
            if (event) {
                setHomeFilter(
                    event.filter(item => item.homeTeamRef.name.toLowerCase().includes(search.toLowerCase()))
                );
                setAwayFilter(
                    event.filter(item => item.awayTeamRef.name.toLowerCase().includes(search.toLowerCase()))
                );
                setHostFilter(
                    event.filter(item => item.hostuser.userName.toLowerCase().includes(search.toLowerCase()))
                );
                setSearchList(true);
            }
        }
        else {
            setHomeFilter(null);
            setAwayFilter(null);
            setHostFilter(null);
            setSearchList(false);
        }
    }, [search])

    useEffect(() => {
        if (searchList) {
            if (homeFilter == []) {
                setHomeFilter(null);
            }
            if (awayFilter == []) {
                setAwayFilter(null);
            }
            if (hostFilter == []) {
                setHostFilter(null);
            }
        }
    }, [homeFilter, awayFilter, hostFilter])
    

    useEffect(() => {
        if(router.pathname !== '/events'){
            setTimeout(function() {
                setSearch("")
            }, 1500);
        }    
    }, [router])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (search != "") {
            Router.push({ pathname: '/events', query: { search: search } });
        }
    }
    return (
        <form onSubmit={handleSubmit} className="form-inline my-2 my-lg-0 d-flex align-items-center flex-nowrap">
            <label className="sr-only">Search Team or Host</label>
            <div className='search-field'>
                <input className="form-control me-sm-2" type="text"  value={search} onChange={handleChange} placeholder="Search Team or Host..." />
            </div>
            <button id="search-button" className="btn btn-secondary my-2 ml-1 me-3 my-sm-0" type="submit">Search</button>
        </form>
    )
}

export default Search