import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";

interface Inventories {
  id: number;
  project: string;
  category: string;
  product_name: string;
  satin_alinan_tarih: string;
  count: string;
  price: string;
  description: string;
  account: string;
  e_commerce_site: string;
  company: string;
  where_in_the_office: string;
  responsible_person: string;
  ordering_person: string;
  created_at: string;
  updated_at: string;
}

const InventoryView = (id:any) => {
  const [inventories, setInventories] = useState<Inventories | null>(null);
  
  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await axiosInstance.get(`/inventory/${id.rowId}`);
        setInventories(response.data); 
        console.log(response.data);
        
      } catch (error) {
        console.log("Error fetching Jobs:", error);
        throw error;
      }
    };

    fetchInventories();
  }, [id]);

  if (!inventories) {
    return <div>Loading...</div>;
  }



  return (
    <div >
      <p>Jobs Name: {inventories.project}</p>
      <p>Jobs Name: {inventories.category}</p>
      <p>Jobs Name: {inventories.product_name}</p>
      <p>Jobs Name: {inventories.satin_alinan_tarih}</p>
      <p>Jobs Name: {inventories.count}</p>
      <p>Jobs Name: {inventories.price}</p>
      <p>Jobs Name: {inventories.description}</p>
      <p>Jobs Name: {inventories.account}</p>
      <p>Jobs Name: {inventories.e_commerce_site}</p>
      <p>Jobs Name: {inventories.company}</p>
      <p>Jobs Name: {inventories.where_in_the_office}</p>
      <p>Jobs Name: {inventories.responsible_person}</p>
      <p>Jobs Name: {inventories.ordering_person}</p>
      <p>Created At: {inventories.created_at}</p>
      <p>Updated At: {inventories.updated_at}</p>
      {/* Add other fields as needed */}
    </div>
                
  );
};

export default InventoryView;
