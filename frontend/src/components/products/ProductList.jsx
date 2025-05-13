import React from "react";
import ProductCard from "./ProductCard";

const ProductList = (props) => {
  if (props.loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-gray-300 h-48 w-full"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (props.error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{props.error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }
  console.log('This is the product length : ',props.products)

  if (props.lengths === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-600">
          Try changing your search criteria or check back later for new
          products.
        </p>
      </div>
    );
  }
  console.log('This is the ProductList ' , props.products)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      
      {props.products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
