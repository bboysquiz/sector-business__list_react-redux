import './Search.css'
import { useSelector, useDispatch } from "react-redux";
import { setSearch } from '../../store/searchSlice';
import React from 'react'


const Search = () => {
  const dispatch = useDispatch();//получение функции dispatch для отправки экшенов в хранилище 
  const search = useSelector((state) => state.search.search); //получение текущего состояния строки поиска в сторе

  //отправка обновленного значения в стор
  const handleInput = (event) => {
    dispatch(setSearch(event.target.value));
  };
  
  return (
    <div className='search'>
      <input 
        className='input'
        type="text"
        placeholder="Поиск"
        value={search}
        onChange={handleInput}
      />
    </div>
  )
}

export default Search 