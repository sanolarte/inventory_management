import { useState } from "react";

export default function ProductForm({ onSubmit }) {
    const [form, setForm] = useState({ name: "", price: "", quantity: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            name: form.name,
            price: parseFloat(form.price),  // ensure numbers
            quantity: parseInt(form.quantity),
            description: form.description,
        };
        onSubmit(newProduct);
        setForm({ name: "", price: "", quantity: "", description: "" });
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
            <input
                name="name"
                placeholder="Name"
                className="border p-2"
                value={form.name}
                onChange={handleChange}
            />
            <input
                name="price"
                placeholder="Price"
                className="border p-2"
                value={form.price}
                onChange={handleChange}
            />
            <input
                name="quantity"
                placeholder="Qty"
                className="border p-2"
                value={form.quantity}
                onChange={handleChange}
            />
            <input
                name="description"
                placeholder="Desc"
                className="border p-2"
                value={form.description}
                onChange={handleChange}
            />
            <button className="bg-green-500 text-white px-4 rounded">Add</button>
        </form>
    );
}
