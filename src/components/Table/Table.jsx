import './Table.css';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Table = () => {
    const search = useSelector((state) => state.search.search);//получает данные из стора, какой текст написан в инпуте
    const { page } = useParams(); // извлечение параметра значения page(параметр из url) из объекта, который возвращает этот хук
    const [notes, setNotes] = useState([]);//массив записей
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });//в объекте содержатся данные: по какому параметру сортировка, по возрастанию или убыванию
    const [filteredNotes, setFilteredNotes] = useState([]);//содержит только те записи, текст которых есть в строке поиска
    const [totalNotes, setTotalNotes] = useState(0)//содержит количество записей полученных с сервера
    const itemsPerPage = 10; //количество записей, которое отображается на каждой странице
    const navigate = useNavigate(); //функция из хука для перехода на необходимую страницу
    const [currentPage, setCurrentPage] = useState(parseInt(page) || 1); // текущая страница
    const startIndex = (currentPage - 1) * itemsPerPage;//вычисление индекса записи, с которого нужно начать выборку данных для текущей страницы
    const endIndex = startIndex + itemsPerPage;//вычисление конечного индекса записи, до которого нужно выбирать данные для текущей страницы
    const totalPages = Math.ceil(totalNotes / itemsPerPage);//Количество страниц всего

    //при изменении page в url меняется state c текущей страницей
    useEffect(() => {
        setCurrentPage(parseInt(page) || 1);
    }, [page]); 

    //запрос записей с сервера, установка состояния notes и totalNotes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
                if (response) {
                    const allNotes = []
                    for (let i = 0; i < response.data.length; i++) {
                        const note = {
                            id: i,
                            title: response.data[i].title,
                            body: response.data[i].body,
                            page: Math.ceil(i / itemsPerPage)
                        };
                        allNotes.push(note);
                    }
                    setNotes(allNotes);
                    setTotalNotes(allNotes.length);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    //функция принимает в качестве аргумента номер необходимой страницы и осуществляет переход на требуемую страницу в соответствии с утсановленным параметром в url
    const handlePageChange = (pageNumber) => {
        navigate(`/${pageNumber}`);
    };

    // Фильтруем данные на основе значения поиска и устанавливаем отфильтрованные данные
    useEffect(() => {
        const filterNotes = () => {
            setFilteredNotes(
                notes.filter((note) =>
                    String(note.id).includes(search) ||
                    note.title.toLowerCase().includes(search.toLowerCase()) ||
                    note.body.toLowerCase().includes(search.toLowerCase())
                )
            );
            setCurrentPage(1)
        };
        filterNotes();
    }, [search, notes]);

    //Функция принимает в качестве аргумента параметр сортировки и сортирует либо по возрастанию, либо по убыванию
    const handleSort = (sortKey) => {
        let direction = 'asc';
        if (sortConfig.key === sortKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: sortKey, direction });
    };

    //Функция выполняет сортировку отфильтрованных записей в зависимости от текущей конфигурации сортировки
    const sortedNotes = filteredNotes.slice().sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        } else {
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        }
    });
    
    const currentPageData = sortedNotes.slice(startIndex, endIndex);//Создание массива записей для текущей страницы

    //переход на предыдущую страницу
    const handlePagePre = () => {
        navigate(`/${currentPage - 1}`)
    }
    //переход на следующую страницу
    const handlePageNext = () => {
        navigate(`/${currentPage + 1}`)
    }

    //скрол вниз при переходе на другую страницу
    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight)
    }, [page]);

    return (
        <div className='main'>
            <table className='table'>
                <thead className='thead'>
                    <tr className='thead-row'>
                        <th className='table-head' onClick={() => handleSort('id')}> <span className="table-head__span">ID</span> </th>
                        <th className='table-head' onClick={() => handleSort('title')}> <span className="table-head__span">Заголовок</span> </th>
                        <th className='table-head' onClick={() => handleSort('body')}> <span className="table-head__span">Описание</span> </th>
                    </tr>
                </thead>
                <tbody className='tbody'>
                    {currentPageData.map((note) => (
                        <tr className='table-row' key={note.id}>
                            <td className='table-data table-id'>{note.id}</td>
                            <td className='table-data table-title'>{note.title}</td>
                            <td className='table-data table-body'>{note.body}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagination'>
                <button
                    className="pagination__step-button"
                    onClick={handlePagePre}
                    disabled={currentPage === 1}
                >
                    Назад
                </button>
                <div className="pagination__pages">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                        (pageNumber) => (
                            <button
                                className='pagination__button'
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                disabled={pageNumber === currentPage}
                            >
                                {pageNumber}
                            </button>
                        )
                    )}
                </div>
                <button
                    className="pagination__step-button"
                    onClick={handlePageNext}
                    disabled={currentPage === totalPages}
                >
                    Далее
                </button>
            </div>
        </div>
    );
};

export default Table;
