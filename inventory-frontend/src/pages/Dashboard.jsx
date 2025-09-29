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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow px-6 py-4 flex justify-between">
                <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </header>
            <main className="flex-1 px-6 py-6">
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <ProductForm onSubmit={handleCreate} />
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    <ProductTable products={products} onDelete={handleDelete} onUpdate={handleUpdate} />
                </div>
            </main >
        </div >

    );
}
