import React, { useState } from 'react';
import './NewsForm.css';

const NewsForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('file', file);

        console.log('Form Submitted');
    };

    return (
        <div className="news-form-container">
            <h2>Add News</h2>
            <form onSubmit={handleSubmit} className="news-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="title">News Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter news title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="event">Event</option>
                            <option value="announcement">Announcement</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        placeholder="Enter news description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="file">Upload File/Image</label>
                    <input
                        type="file"
                        id="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Submit News
                </button>
            </form>
        </div>
    );
};

export default NewsForm;
