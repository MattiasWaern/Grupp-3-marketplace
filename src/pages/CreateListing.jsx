import { useState } from "react";
import '../css/createListing.css';  

// Skapa en annons med titel, beskrivning, pris, plats och publiceringsdatum
function CreateListing() {  
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        category: "",
    })

    // state för bildhantering och underkategori
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");  
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");

    // Kategorier
    const categories = [
        { id: "Elektronik", name: "Elektronik", icon: "?", color: "#667eea"},
        { id: "Kläder",  name: "Kläder", icon: "?", color: "#667eea",
            subcategories: [
            { id: "Herr", name: "Herr", icon: "?" },
            { id: "Dam", name: "Dam", icon: "?" },
            { id: "Barn", name: "Barn", icon: "?" }
        ]
    },
        { id: "Böcker", name: "Böcker", icon: "?", color: "#667eea"},
    ]

    // Hantera formulärändringar
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hantera bildval och förhandsgranskning
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

            if(!allowedTypes.includes(file.type)){
                setError("Endast JPG, PNG, WEBP är tillåtna");
                return;
            }

            if(file.size > 5 * 1024*1024){
                setError("Bilder får max vara 5MB");
                return;
            }

            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const uploadImageToStrapi = async (file, token) => {
        const formData = new FormData();
        formData.append("files", file);

        try {
            const response = await fetch("http://localhost:1337/api/upload", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData  
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const data = await response.json();
            return data[0].id;
        } catch (error){
            console.error("Strapi upload failed", error);
            return null;
        }
    }

    // Skapa annons
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError("");
        setSuccess("");
        setUploadProgress(0);

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if(!token || !userId){
            setError("Du måste vara inloggad för att skapa en annons");
            setLoading(false);
            alert("Du måste vara inloggad för att skapa en annons");
            return;
        }

        if(!formData.title || !formData.price || !formData.category){
            setError("Titel, pris och kategori måste fyllas i");
            setLoading(false);
            return;
        }

        // Om en bild har valts, ladda upp den först och få tillbaka dess ID för att koppla den till annonsen
        try {
            let imageId = null;

            if (imageFile){
                setUploadProgress(30);
                imageId = await uploadImageToStrapi(imageFile, token);
                setUploadProgress(70);
            }

            // Skapa annonsen i Strapi, inkludera bild-ID om en bild laddades upp
            const listingData = {
                data: {
                    title: formData.title,
                    description: formData.description,
                    price: parseInt(formData.price),
                    location: formData.location,
                    category: formData.category,
                    subcategory: selectedSubcategory,
                    publishedAt: new Date().toISOString(), 
                    user: userId,
                    ...(imageId && { image: imageId })
                }
            };

            const response = await fetch("http://localhost:1337/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(listingData)
            });

           if(!response.ok){
                const errorData = await response.json();
                console.error("Strapi detaljerat felmeddelande:", errorData); // <--- LÄGG TILL DENNA
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message}`);
            }

            
            setUploadProgress(100);
            setSuccess("Annons skapad och kopplad till användaren");

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
                setSuccess("");
                setUploadProgress(0);
            }, 3000)

        } catch (err){
            console.error("Error creating listing", err);
            setError(err.message);
        } finally {
            setLoading(false)
        }
    }

    // Hjälpfunktion för att få kategori-ikonen baserat på kategori-ID
    const getCategoryIcon = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.icon : "📦";
    };

    return (
        <div className="create-listing-container">
            <h1>Skapa ny annons</h1>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                        {uploadProgress}%
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Titel *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ange en tydlig titel"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Kategori *</label>
                    <div className="category-grid">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                type="button"
                                className={`category-btn ${formData.category === category.id ? 'active' : ''}`}
                                style={{
                                    borderColor: formData.category === category.id ? category.color : '#e2e8f0',
                                    backgroundColor: formData.category === category.id ? `${category.color}10` : 'white'
                                }}
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, category: category.id }));
                                    setSelectedSubcategory(""); // Återställ underkategori
                                }}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Underkategori visas bara om huvudkategori har subkategorier */}
                {formData.category && categories.find(c => c.id === formData.category)?.subcategories && (
                    <div className="form-group">
                        <label>Underkategori</label>
                        <div className="subcategory-grid">
                            {categories
                                .find(c => c.id === formData.category)
                                ?.subcategories.map(sub => (
                                    <button
                                        key={sub.id}
                                        type="button"
                                        className={`subcategory-btn ${selectedSubcategory === sub.id ? 'active' : ''}`}
                                        onClick={() => setSelectedSubcategory(sub.id)}
                                    >
                                        <span>{sub.icon}</span>
                                        <span>{sub.name}</span>
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
                
                <div className="form-group">
                    <label>Bilder</label>
                    <div className="image-upload-area">
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            className="upload-btn"
                            onClick={() => document.getElementById('image-upload').click()}
                        >
                            📸 Välj bild
                        </button>
                        
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={() => {
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        
                        <p className="upload-hint">Max 5MB. JPG, PNG eller WEBP</p>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Beskrivning</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Beskriv din annons..."
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Pris *</label>
                        <div className="price-input">
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0"
                                required
                            />
                            <span className="price-currency">kr</span>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Plats</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="T.ex. Stockholm, Göteborg..."
                        />
                    </div>
                </div>
                
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Skapar annons..." : "Skapa annons"}
                </button>
            </form>
        </div>
    );
}

CreateListing.route = {
    path: '/createlisting',
    index: 4,
};

export default CreateListing; 