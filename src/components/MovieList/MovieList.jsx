import React, { useState, useEffect } from 'react'
import _ from 'lodash'

import './MovieList.css'
import MovieCard from './MovieCard'
import FilterGroup from './FilterGroup'

const MovieList = ({type,title,emoji}) => {
    const [movie, setMovie] = useState([]);
    const [filterMovies, setFilterMovies] = useState([])
    const [minRating, setMinRating] = useState(0)
    const [sort, setSort] = useState({
        by: "dafault",
        order: "asc"
    })
    useEffect(() => { fetchMovies(); }, [])
    useEffect(() => {
        if (sort.by !== "default") {
         const sortedMovies =  _.orderBy(filterMovies, [sort.by], [sort.order])
         setFilterMovies(sortedMovies)
        }
    }, [sort])

    const fetchMovies = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=a16f0cc0cdfd04fd8048203ce60d24a4`);
        const data = await response.json()
        console.log(data)
        setMovie(data.results)
        setFilterMovies(data.results)
    }

    const handleFilter = rate => {
        if (rate === minRating) {
            setMinRating(0)
            setFilterMovies(movie)
        } else {
            setMinRating(rate)

            const filtered = movie.filter(movie => movie.vote_average >= rate)
            //    setMovie(filtered)
            setFilterMovies(filtered)
        }

    }

    const handleSort = e => {
        const { name, value } = e.target;
        // setSort(prev=>{
        //     return {...prev, [name]:value}
        // })
        setSort(prev => ({ ...prev, [name]: value }))
    }
    // console.log(sort)
    return (
        <section className="movie_list" id={type}>
            <header className='align_center movie_list_header'>

                <h2 className='align_center movie_list_heading'>{title}{""} <img src={emoji} alt="" className='navbar_emoji'></img>

                </h2>
                <div className="align_center movie_list_fs">
                    <FilterGroup minRating={minRating} onRatingClick={handleFilter} ratings={[8, 7, 6]}></FilterGroup>

                    <select name='by' id='' className='movie_sorting' onChange={handleSort} value={sort.by} >
                        <option value='dafault'>SortBy</option>
                        <option value='release_date'>Date</option>
                        <option value='vote_avarage'>Rating</option>
                    </select>

                    <select name='order' id='' className='movie_sorting' onChange={handleSort} value={sort.order} >
                        <option value='asc'>Ascending</option>
                        <option value='desc'>Descending</option>
                    </select>

                </div>
            </header>
            <div className="movie_cards">
                {/* <MovieCard></MovieCard> */}
                {
                    filterMovies.map(movie => (<MovieCard key={movie.id} movie={movie}></MovieCard>))
                }

            </div>

        </section>
    )
}

export default MovieList