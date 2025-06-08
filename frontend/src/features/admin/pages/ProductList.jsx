import React, { useState } from 'react';

const mockProducts = [
  {
    id: 1,
    code: 'SAP001',
    title: 'SAP FICO Certification',
    price: '$200',
    category: 'Finance',
    status: 'Unpublish',
  },
  {
    id: 2,
    code: 'SAP002',
    title: 'SAP ABAP Training',
    price: '$150',
    category: 'Development',
    status: 'Publish',
  },
  {
    id: 3,
    code: 'SAP003',
    title: 'SAP HANA Basics',
    price: '$180',
    category: 'Database',
    status: 'Publish',
  },
];

const ProductList = () => {
  const [search, setSearch] = useState('');

  const filteredProducts = mockProducts.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center space-x-2">
          <select className="border px-2 py-1 rounded">
            <option>Choose a option</option>
          </select>
          <select className="border px-2 py-1 rounded">
            <option>All Categories</option>
          </select>
          <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Filter</button>
          <button className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600">Bulk Delete</button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">+ Add Product</button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            Show&nbsp;
            <select className="border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>&nbsp;entries
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border"><input type="checkbox" /></th>
              <th className="p-2 border">SAP Exam. Code</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="p-2 border"><input type="checkbox" /></td>
                <td className="p-2 border">{product.code}</td>
                <td className="p-2 border">[Img]</td>
                <td className="p-2 border">{product.title}</td>
                <td className="p-2 border">{product.price}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded text-white text-xs ${product.status === 'Publish' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-2 border space-x-1">
                  <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                  <button className="bg-pink-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                  <button className="bg-teal-500 text-white px-2 py-1 rounded text-xs">Copy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
