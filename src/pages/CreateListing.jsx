import { useState } from "react";

function createListing(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [published, setPublished] = useState("");


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

        const data = await response.json();
        console.log(data);
    };

    return (
      <form onSubmit={handleSubmit}>

        <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
        placeholder="Beskrivning"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />

        <input
        type="number"
        placeholder="Pris"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        />

        <input
        type="text"
        placeholder="Plats"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        />

        <input
        type="date"
        value={published}
        onChange={(e) => setPublished(e.target.value)}
        />

        <button type="submit">
            Skapa annons
        </button>
      </form>  
    );
}

export default createListing;