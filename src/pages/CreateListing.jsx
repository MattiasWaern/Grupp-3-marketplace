import { useState } from "react";
import '../css/createListing.css';


// Skapa en annons med titel, beskrivning, pris, plats och publicerignsdatum
function createListing(){
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        category: "",
    })

const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [succes, setSucces] = useState("");
const [uploadProgress, setUploadProgress] = useState(0);


    // Skicka data till backend
    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch("http://localhost:1337/api/listings", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body:JSON.stringify({
                data: {
                    title,
                    description,
                    price,
                    location,
                    published,
                },
            }),
        });

        // Logga svaret från backend
        const data = await response.json();
        console.log(data);
    };


    // Formulär för att skapa en annons
    return (
      <form onSubmit={handleSubmit} className="form-container">

        <h2 className="form-title">Skapa annons</h2>

        <input
        className="input-field"
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
        className="input-field"
        placeholder="Beskrivning"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />

        <input
        className="input-field"
        type="number"
        placeholder="Pris"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        />

        <input
        className="input-field"
        type="text"
        placeholder="Plats"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        />

        <input
        className="input-field"
        type="date"
        value={published}
        onChange={(e) => setPublished(e.target.value)}
        />

        <button className="button-submit" type="submit">
            Skapa annons
        </button>
      </form>  
    );
}

export default createListing;