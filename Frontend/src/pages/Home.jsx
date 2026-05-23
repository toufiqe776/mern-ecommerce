import { useEffect,useState } from "react";
import {api} from '../api/axios';
import {Link} from 'react-router';

export default function Home(){
    const [products,setProducts] =useState([]);
    const [search,setSearch] =useState("");
    const [category,setCategory] =useState([]);
    
   const loadProducts =async () =>{
    const res =await api.get(`/products?search=${search}&category=${category}`);
    setProducts(res.data);
   }
 useEffect(()=>{
    loadProducts();
 },[search,category]);

return (
    <div className="p-6">
         {/*search*/} 
        <div className="mb-4 flex gap-3">
            <input 
            placeholder="Search Products..."
            onChange={(e)=> setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-1/2"

            />
            {/*category*/} 
            <select 
            value={category}
            onChange={(e) =>setCategory(e.target.value)}
            className="border px-3 py-2 rounded">
             <option value="">All Categories</option>
             <option value="laptops"> Laptop</option>
             <option value="Fashion"> Fashion</option>
             <option value="Mobile"> Mobile</option>
            </select>
        </div>
{/*Product grid*/}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {
                    products.map((product) =>(
                        <Link 
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="border =-3 rounded shadow hover:shadow-lg transition"
                        > 
                        <img  
                        src={product.image}
                        alt={product.title}
                        className="w-full h-40 object-contain bg-white rounded p-4"
                        />
                        <h2  className="mt-2 front-semibold text-lg">{product.title}</h2>
                        <p className="text-gray-600">${product.price}</p>
                        </Link>
                    ))
                }
            </div>


    </div>
)


}