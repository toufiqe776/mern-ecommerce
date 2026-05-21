import {useState} from 'react';
import {api} from '../api/axios';

import {useNavigate} from 'react-router';

export default function AddProduct(){
    const [form,setForm] =useState({
     title:"",
     description:"",
     price:"",
     category:"",
     image:"",
     stock:"",

    });

    const navigate =useNavigate();

    const handleChange =(e) =>{
        setForm({
            ...form,
            [e.target.name]:e.target.value,
        });
    }
    const handleSubmit =async (e) =>{
        e.preventDefault();
        try{
          await api.post("/products/add",form);
          alert("Product added successfully");
          navigate("/admin/products");
        }catch(err){
            console.error("Error adding product:",err);
        }
    }

    return(
        <div className="max-w-lg max-auto mt-10 bg-white p-6 shadow rounded ">
        <h2 className="text-2xl font-bold mb-6"> Add New Product</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>

            {
                Object.keys(form).map((key) => (
          <input
            key={key}
            type={
              key === "price" || key === "stock"
                ? "number"
                : "text"
            }
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={
              key.charAt(0).toUpperCase() + key.slice(1)
            }
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        ))
            }
            <button type="submit" className='w-full bg-blue-500 text-white -2 rounded hover:bg-blue-600'>
                Add Product

            </button>
        </form>

        </div>
    )

}
