import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

const CategoryView = (id:any) => {
  const [category, setCategory] = useState<Category | null>(null);
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`/Category/${id.rowId}`);
        setCategory(response.data); 
      } catch (error) {
        console.log("Error fetching Category:", error);
        throw error;
      }
    };

    fetchCategory();
  }, [id]);

  if (!category) {
    return <div>Loading...</div>;
  }



  return (
    <div >
      <p>category Name: {category.category_name}</p>
      <p>Created At: {category.created_at}</p>
      <p>Updated At: {category.updated_at}</p>
      {/* Add other fields as needed */}
    </div>
                
  );
};

export default CategoryView;
