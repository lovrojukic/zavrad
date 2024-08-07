import React, { useEffect, useState } from 'react';
import Header from "./Header";
import axios from "axios";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import "./Ponuda.css";

function Primka(props) {
    const { isLoggedIn, onLogout } = props;
    const [artikli, setArtikli] = useState([]);
    const [kosarica, setKosarica] = useState([]);
    const [kolicine, setKolicine] = useState({});
    const [primkaGenerirana, setPrimkaGenerirana] = useState(false);

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
            id: artikl.id,
            dobavljac: artikl.supplier
        };

        const postojecaStavka = kosarica.find(stavka => stavka.id === novaStavka.id);
        if (postojecaStavka) {
            setKosarica(kosarica.map(stavka =>
                stavka.id === novaStavka.id ? { ...stavka, kolicina: parseInt(kolicine[artikl.id], 10) } : stavka
            ));
        } else {
            setKosarica([...kosarica, novaStavka]);
        }
    };

    const izracunajUkupnuCijenu = () => {
        return kosarica.reduce((ukupno, stavka) => ukupno + stavka.cijena * stavka.kolicina, 0);
    };

    const generirajPrimku = () => {
        const doc = new jsPDF();
        doc.text('Primka', 20, 20);
        const tableColumn = ["Ime Artikla", "Cijena", "Kolicina", "Dobavljac"];
        const tableRows = [];

        kosarica.forEach(stavka => {
            const rowData = [
                stavka.ime,
                `${stavka.cijena} kn`,
                stavka.kolicina,
                stavka.dobavljac
            ];
            tableRows.push(rowData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 30 });
        doc.text(`Ukupno: ${izracunajUkupnuCijenu()} kn`, 20, doc.lastAutoTable.finalY + 10);
        doc.save('primka.pdf');
        setPrimkaGenerirana(true);
    };

    const potvrdiPrimku = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const formattedData = kosarica.map(item => ({
                articleId: item.id,
                additionalAmount: item.kolicina
            }));

            const response = await axios.post('http://localhost:8080/api/article/addcount', formattedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert('Zalihe su uspješno ažurirane!');
                setKosarica([]); // Clear cart after successful update
                setPrimkaGenerirana(false);
            }
        } catch (error) {
            console.error('Error updating inventory:', error);
            alert('Problem pri ažuriranju zaliha. Pokušajte ponovo.');
        }
    };

    return (
        <div className="ponuda-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <h2>Ponuda Artikala</h2>
            <ul className="artikli-list">
                {artikli.map(artikl => (
                    <li key={artikl.id} className="artikl-item">
                        {artikl.name} - {artikl.price} kn
                        <input
                            type="number"
                            value={kolicine[artikl.id]}
                            onChange={(e) => handleQuantityChange(artikl.id, e.target.value)}
                            min="1"
                            style={{ width: '50px', margin: '0 10px' }}
                        />
                        <button onClick={() => dodajUKosaricu(artikl)}>Dodaj u košaricu</button>
                    </li>
                ))}
            </ul>
            <div className="kosarica">
                <h3>Košarica</h3>
                <ul>
                    {kosarica.map(stavka => (
                        <li key={stavka.id}>
                            {stavka.ime} -
                            <input
                                type="number"
                                value={stavka.kolicina}
                                onChange={(e) => handleQuantityChange(stavka.id, e.target.value)}
                                min="1"
                                style={{ width: '50px', margin: '0 10px' }}
                            /> x - {stavka.cijena} kn
                        </li>
                    ))}
                </ul>
                <p>Ukupna cijena: {izracunajUkupnuCijenu()} kn</p>
                {izracunajUkupnuCijenu() > 0 && (
                    <button onClick={generirajPrimku} className="auth-button">Generiraj Primku</button>
                )}
                {primkaGenerirana && (
                    <button onClick={potvrdiPrimku} className="auth-button">Potvrdi Primku</button>
                )}
            </div>
        </div>
    );
}

export default Primka;
