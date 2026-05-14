import { useState } from "react";
import '../css/createListing.css';
import { list } from "postcss";


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

//Kategorier

const categories = [
    { id: "electronics", name: "Elektronik", icon: "?", color: "#667eea"},
    { id: "clothes", name: "Kläder", icon: "?", color: "#667eea"},
    { id: "books", name: "Böcker", icon: "?", color: "#667eea"},
]


const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
        // Validera filtyp
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

        if(!allowedTypes.includes(file.type)){
            setError("Endast JPG, PNG, WEBP är tillåtna");
            return;
        }

        // Validera storlek
        if(file.size > 5 * 1024*1024){
            setError("Bilder får max vara 5MB");
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError("");
    }
};

const uploadImageToStrapi = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
        const response = await fetch("http://localhost:1337/api/upload", {
            method: "POST",
            headers: {
                   "Content-Type": "application/json",
                   'Authorization': `fd25e7f558c2ed1ad11eaeb9b25c13325f790864900fe14c08b0130e2fd9cf72af630d1651b8200e83bd0494144aa2081da5ecaab2deb635acaa191cccc795f24cf7b1529371e6e315bb32308906e729d5984dd3da82cbe6300d53454419905046034284f85ec859ad430136c845ed528d614c820219f2de7c5b956601b21af9`
            },
            body: JSON.stringify({ data: formData})
        });

        const data = await response.json();
        return data[0].id; // Returnera bildens ID i strapi
    } catch (error){
        console.log("Strapi upload failed", error);
        return null;
    }
}


    // Skicka data till backend
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError("");
        setSucces("");
        setUploadProgress(0);

        //Validering
        if(!formData.title || !formData.price || !formData.category){
            setError("Titel, pris och kategori måste fyllas i");
            setLoading(false);
            return;
        }

        try {
            let imageId = null;

            // Ladda upp bild om det finns
            if (imageFile){
                setUploadProgress(30);
                imageId = await uploadImageToStrapi(imageFile);
                setUploadProgress(70);
            }


            //Skapa annonsen
            const listingData = {
                data:{
                    title: formData.title,
                    description: formData.description,
                    price: parseInt(formData.price),
                    location: formData.location,
                    category: formData.category,
                    publishedAt: new Date().toISOString(),
                    ...arguments(imageId && {image: imageId})
                }
            };

            const response = await fetch("http://localhost:1337/api/listings", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": ``
            },
            body:JSON.stringify(listingData)
        });

        if(!response.ok){
            throw new error(`HTTP ${response.status}`);
        }


        setUploadProgress(100);
        setSucces("Annons skapad");

        //Återställ formuläret
        setFormData({
            title: "",
            description: "",
            price: "",
            location: "",
            category: ""
        });
        setImageFile(null);
        setImagePreview(null);

        setTimeout(() => {
            setSucces("");
            setUploadProgress(0);
        }, 3000)

    } catch (err){
        console.error("Error creating listing", error);
        setError(err.message);

    } finally {
        setLoading(false)
    }

    const getCategoryIcon = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.icon: ""
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
}
export default createListing;