import Header from './Header';
import axios from 'axios';
import { useState } from "react";
import "./AddArticle.css";

const AddArticle = (props) => {
    const { isLoggedIn, onLogout } = props;
    const [articleData, setArticleData] = useState({
        name: '',
        amount: '',
        price: '',
        supplier: '',
        demandVariability: '',
        monthlyDemand: '',
        leadTime: ''
    });

    const handleChange = (e) => {
        setArticleData({ ...articleData, [e.target.id]: e.target.value });
    }

    async function save(event) {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const formattedData = {
            ...articleData,
            amount: parseInt(articleData.amount), // osigurava da je količina broj
            price: parseFloat(articleData.price), // osigurava da je cijena broj
            demandVariability: parseFloat(articleData.demandVariability),
            monthlyDemand: parseInt(articleData.monthlyDemand),
            leadTime: parseInt(articleData.leadTime)
        };

        try {
            console.log("Submitting:", formattedData);
            const response = await axios.post("http://localhost:8080/api/article", formattedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            alert("Artikl uspješno dodan!");
            console.log(response.data);
        } catch (err) {
            console.error("Došlo je do greške:", err.response ? err.response.data.message : err.message);
            alert(err.response ? err.response.data.message : "Došlo je do greške!");
        }
    }

    return (
        <div className="page-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <div className="register-container">
                <h2>Dodavanje artikla</h2>
                <form onSubmit={save} id="addArticleForm">
                    <div className="form-group">
                        <label htmlFor="name">Ime Artikla:</label>
                        <input type="text" id="name" value={articleData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Količina:</label>
                        <input type="number" id="amount" value={articleData.amount} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Cijena:</label>
                        <input type="number" id="price" value={articleData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="supplier">Dobavljač:</label>
                        <input type="text" id="supplier" value={articleData.supplier} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="demandVariability">Varijabilnost Potražnje:</label>
                        <input type="number" id="demandVariability" value={articleData.demandVariability} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="monthlyDemand">Mjesečna Potražnja:</label>
                        <input type="number" id="monthlyDemand" value={articleData.monthlyDemand} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="leadTime">Vrijeme Nabave (dani):</label>
                        <input type="number" id="leadTime" value={articleData.leadTime} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <button type="submit">Dodaj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddArticle;
