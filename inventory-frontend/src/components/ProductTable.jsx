// src/components/ProductTable.jsx
import { useState } from "react";

export default function ProductTable({ products, onDelete, onUpdate }) {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", price: "", quantity: "" });

    const startEdit = (p) => {
        setEditingId(p.id);
        setEditForm({ name: p.name, price: p.price, quantity: p.quantity });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: "", price: "", quantity: "" });
    };

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const submitEdit = (id) => {
        onUpdate(id, {
            name: editForm.name,
            price: parseFloat(editForm.price),
            quantity: parseInt(editForm.quantity),
        });
        cancelEdit();
    };

    return (
        <table className="min-w-full border">
            <thead>
                <tr className="bg-gray-100">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((p) => (
                    <tr key={p.id}>
                        <td className="p-2 border">
                            {editingId === p.id ? (
                                <input
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleChange}
                                    className="border p-1"
                                />
                            ) : (
                                p.name
                            )}
                        </td>
                        <td className="p-2 border">
                            {editingId === p.id ? (
                                <input
                                    name="price"
                                    value={editForm.price}
                                    onChange={handleChange}
                                    className="border p-1"
                                />
                            ) : (
                                p.price
                            )}
                        </td>
                        <td className="p-2 border">
                            {editingId === p.id ? (
                                <input
                                    name="quantity"
                                    value={editForm.quantity}
                                    onChange={handleChange}
                                    className="border p-1"
                                />
                            ) : (
                                p.quantity
                            )}
                        </td>
                        <td className="p-2 border space-x-2">
                            {editingId === p.id ? (
                                <>
                                    <button
                                        onClick={() => submitEdit(p.id)}
                                        className="bg-green-500 text-white px-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="bg-gray-400 text-white px-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => startEdit(p)}
                                        className="bg-blue-500 text-white px-2 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(p.id)}
                                        className="bg-red-500 text-white px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
