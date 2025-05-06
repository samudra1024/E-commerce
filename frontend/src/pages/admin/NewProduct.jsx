import React from "react";

const NewProduct = () => {
  return (
    <div className="flex justify-center h-fit">
      <div className="bg-white p-3 m-10 w-6/12 border rounded-xl">
        <div className="text-center text-3xl py-10">Enter Product Details</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className=" p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start ">
              Product Name :{" "}
            </div>
            <input
              id="name"
              name="name"
              type="name"
              required
              // value={formData.email}
              // onChange={handleChange}
              className=" appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
            />
          </div>
          <div className="  p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start  ">
              Product price :{" "}
            </div>
            <input
              id="price"
              name="price"
              type="price"
              required
              // value={formData.email}
              // onChange={handleChange}
              className="  appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product price"
            />
          </div>
          <div className="  p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start  ">
              Product image :{" "}
            </div>
            <input
              id="image"
              name="image"
              type="text"
              required
              // value={formData.email}
              // onChange={handleChange}
              className="  appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product image"
            />
          </div>
          <div className="  p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start  ">
              Product brand :{" "}
            </div>
            <input
              id="brand"
              name="brand"
              type="brand"
              required
              // value={formData.email}
              // onChange={handleChange}
              className="  appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product brand"
            />
          </div>
          <div className="  p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start  ">
              Product category :{" "}
            </div>
            <input
              id="category"
              name="category"
              type="category"
              required
              // value={formData.email}
              // onChange={handleChange}
              className="  appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product category"
            />
          </div>
          <div className="  p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start  ">
              Product InStock :{" "}
            </div>
            <input
              id="InStock"
              name="InStock"
              type="InStock"
              required
              // value={formData.email}
              // onChange={handleChange}
              className="  appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product InStock"
            />
          </div>
          <div className="  p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start  ">
              Product description :{" "}
            </div>
            <input
              id="description"
              name="description"
              type="description"
              required
              // value={formData.email}
              // onChange={handleChange}
              className="  appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description"
            />
          </div>
          <div className="  p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start  ">
              Product discount :{" "}
            </div>
            <input
              id="discount"
              name="discount"
              type="discount"
              required
              // value={formData.email}
              // onChange={handleChange}
              className="  appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product discount"
            />
          </div>
          <div className="  p-2 w-full">
            <div className="block text-sm font-medium text-gray-700 place-items-start  ">
              Product featured :{" "}
            </div>
            <input
              id="featured"
              name="featured"
              type="featured"
              required
              // value={formData.email}
              // onChange={handleChange}
              className="  appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product featured"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/3 m-10">
            <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Submit
            </button>
          </div>
          <div className="w-1/3 m-10 ">
            <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
