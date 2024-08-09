import React, { useEffect, useState } from 'react';
import axios from "axios";
import Header from "./Header";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import "./Ponuda.css";

function Racun(props) {
    const { isLoggedIn, onLogout } = props;
    const [artikli, setArtikli] = useState([]);
    const [kosarica, setKosarica] = useState([]);
    const [kolicine, setKolicine] = useState({});
    const [reorderArticles, setReorderArticles] = useState([]);

    useEffect(() => {
        const fetchArtikli = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/api/article', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setArtikli(response.data);
                const initialQuantities = {};
                response.data.forEach(artikl => {
                    initialQuantities[artikl.id] = 1;
                });
                setKolicine(initialQuantities);
            } catch (error) {
                console.error('Error fetching article data:', error);
            }
        };

        fetchArtikli();
    }, []);

    useEffect(() => {
        const checkReorderLevels = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.post('http://localhost:8080/api/article/check_reorder', {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setReorderArticles(response.data);
            } catch (error) {
                console.error('Error checking reorder levels:', error);
            }
        };

        if (artikli.length > 0) {
            checkReorderLevels();
        }
    }, [artikli]);

    const handleQuantityChange = (id, newQuantity) => {
        setKolicine(prev => ({
            ...prev,
            [id]: newQuantity
        }));
    };

    const dodajUKosaricu = (artikl) => {
        const novaStavka = {
            ime: artikl.name,
            cijena: artikl.price,
            kolicina: parseInt(kolicine[artikl.id], 10),
            id: artikl.id
        };

        const postojecaStavka = kosarica.find(stavka => stavka.id === novaStavka.id);
        if (postojecaStavka) {
            postojecaStavka.kolicina += novaStavka.kolicina;
            setKosarica([...kosarica]);
        } else {
            setKosarica([...kosarica, novaStavka]);
        }
    };

    const handleKosaricaQuantityChange = (id, newQuantity) => {
        setKosarica(prevKosarica =>
            prevKosarica.map(stavka =>
                stavka.id === id
                    ? { ...stavka, kolicina: parseInt(newQuantity, 10) }
                    : stavka
            )
        );
    };

    const izracunajUkupnuCijenu = () => {
        return kosarica.reduce((total, stavka) => total + (stavka.cijena * stavka.kolicina), 0);
    };

    const posaljiNarudzbu = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('http://localhost:8080/api/article/order', {
                articleList: kosarica
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                alert('Narudžba je uspješno poslana.');
                setKosarica([]);
            } else {
                alert('Došlo je do greške pri slanju narudžbe.');
            }
        } catch (error) {
            console.error('Error sending order:', error);
            alert('Došlo je do greške pri slanju narudžbe.');
        }
    };

    const preuzmiPDF = () => {
        const doc = new jsPDF();
        const columns = ["Ime", "Cijena", "Količina", "Ukupno"];
        const data = kosarica.map(stavka => [
            stavka.ime,
            stavka.cijena.toFixed(2),
            stavka.kolicina,
            (stavka.cijena * stavka.kolicina).toFixed(2)
        ]);

        doc.autoTable({
            head: [columns],
            body: data,
            startY: 20,
            theme: 'striped'
        });
        doc.text(`Ukupno: ${izracunajUkupnuCijenu().toFixed(2)} KN`, 14, doc.lastAutoTable.finalY + 10);
        doc.save('Racun.pdf');
    };

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <div className="container">
                <h2>Artikli</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Cijena</th>
                        <th>Količina</th>
                        <th>Akcija</th>
                    </tr>
                    </thead>
                    <tbody>
                    {artikli.map(artikl => (
                        <tr key={artikl.id}>
                            <td>{artikl.name}</td>
                            <td>{artikl.price}</td>
                            <td>
                                <input
                                    type="number"
                                    value={kolicine[artikl.id] || 1}
                                    onChange={(e) => handleQuantityChange(artikl.id, e.target.value)}
                                    min="1"
                                />
                            </td>
                            <td>
                                <button onClick={() => dodajUKosaricu(artikl)}>Dodaj u košaricu</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h2>Košarica</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Cijena</th>
                        <th>Količina</th>
                        <th>Ukupno</th>
                    </tr>
                    </thead>
                    <tbody>
                    {kosarica.map(stavka => (
                        <tr key={stavka.id}>
                            <td>{stavka.ime}</td>
                            <td>{stavka.cijena.toFixed(2)}</td>
                            <td>
                                <input
                                    type="number"
                                    value={stavka.kolicina}
                                    onChange={(e) => handleKosaricaQuantityChange(stavka.id, e.target.value)}
                                    min="1"
                                />
                            </td>
                            <td>{(stavka.cijena * stavka.kolicina).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="total">
                    <h3>Ukupno: {izracunajUkupnuCijenu().toFixed(2)} KN</h3>
                    <button onClick={posaljiNarudzbu}>Pošalji narudžbu</button>
                    <button onClick={preuzmiPDF}>Preuzmi PDF</button>
                </div>
                {reorderArticles.length > 0 && (
                    <div className="reorder-notifications">
                        <h3>Artikli za ponovnu narudžbu:</h3>
                        <ul>
                            {reorderArticles.map((articleName, index) => (
                                <li key={index}>{articleName}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Racun;
