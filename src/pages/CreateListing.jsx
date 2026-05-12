import { useState } from "react";

function createListing(){
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

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
                    price,
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

        <input
        type="number"
        placeholder="Pris"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit">
            Skapa annons
        </button>
      </form>  
    );
}

export default createListing;