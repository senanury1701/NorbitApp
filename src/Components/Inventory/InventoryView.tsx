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
  const [company, setCompany] = useState<any>()
  const [account, setAccount] = useState<any>()


  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await axiosInstance.get(`/inventory/${id.rowId}`);
        setInventories(response.data); 
        const responseCompany = await axiosInstance.get(`/company/${response.data.company}`);
        setCompany(responseCompany)
        console.log(responseCompany);
        
        const responseAccount = await axiosInstance.get(`/ems/employee/${response.data.responsible_person}`);
        setAccount(responseAccount)
        
        
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
    <div>
    <p><strong>Project:</strong> {inventories.project}</p>
    <p><strong>Category:</strong> {inventories.category}</p>
    <p><strong>Product Name:</strong> {inventories.product_name}</p>
    <p><strong>Date of Purchase:</strong> {inventories.satin_alinan_tarih}</p>
    <p><strong>Count:</strong> {inventories.count}</p>
    <p><strong>Price:</strong> {inventories.price}</p>
    <p><strong>Description:</strong> {inventories.description}</p>
    <p><strong>Account:</strong> {inventories.account}</p>
    <p><strong>E-commerce Site:</strong> {inventories.e_commerce_site}</p>
    <p><strong>Company:</strong> {company}</p>
    <p><strong>Location in Office:</strong> {inventories.where_in_the_office}</p>
    <p><strong>Responsible Person:</strong> {account}</p>
    <p><strong>Ordering Person:</strong> {inventories.ordering_person}</p>
    <p><strong>Created At:</strong> {inventories.created_at}</p>
    <p><strong>Updated At:</strong> {inventories.updated_at}</p>
  </div>
                
  );
};

export default InventoryView;
