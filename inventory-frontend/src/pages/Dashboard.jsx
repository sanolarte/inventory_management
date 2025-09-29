import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../auth/AuthContext";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";

export default function Dashboard() {
    const { token, logout } = useAuth();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await client.get("/products", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
    };

    const handleCreate = async (product) => {
        await client.post("/products", product, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
    };

    const handleDelete = async (id) => {
        await client.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
    };

    const handleUpdate = async (id, updatedProduct) => {
        await client.patch(`/products/${id}`, updatedProduct, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
                <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
                    Logout
                </button>
            </div>
            <ProductForm onSubmit={handleCreate} />
            <ProductTable products={products} onDelete={handleDelete} onUpdate={handleUpdate} />
        </div>
    );
}
