import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from "react";

interface Inventories {
  id: number;
  project: number[]; 
  category: number[];
  product_name: string;
  satin_alinan_tarih: string;
  count: string;
  price: string;
  description: string;
  account: string;
  e_commerce_site: string;
  company: number; 
  where_in_the_office: string;
  responsible_person: number;
  ordering_person: []; 
  created_at: string;
  updated_at: string;
}

interface ResPerson {
  id: number;
  username: string;
}
interface OrPerson {
  id: number;
  username: string;
}

interface Company {
  id: number;
  company_name: string;
}

interface Project {
  id: number;
  project_name: string;
}

interface Category {
  id: number;
  name: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const InventoryView = ({ rowId }: { rowId: any }) => {
  const [inventories, setInventories] = useState<Inventories | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [responsiblePerson, setResponsiblePerson] = useState<ResPerson | null>(null);
  const [orderingPerson, setOrderingPerson] = useState<OrPerson[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await axiosInstance.get(`/inventory/${rowId}`);
        const inventoryData = response.data;
        setInventories(inventoryData);

        if (inventoryData.company) {
          const companyResponse = await axiosInstance.get(`/company/${inventoryData.company}`);
          setCompany(companyResponse.data);
        }

        if (inventoryData.responsible_person) {
          const responsiblePersonResponse = await axiosInstance.get(`/ems/employee/${inventoryData.responsible_person}`);
          setResponsiblePerson(responsiblePersonResponse.data);
        }
        
        if (inventoryData.ordering_person.length > 0) {
          const orderingPromises = inventoryData.ordering_person.map((id: number) => axiosInstance.get(`/ems/employee/${id}`));
          const orderingPersonResponse = await Promise.all(orderingPromises);
          setOrderingPerson(orderingPersonResponse.map(response => response.data));
        }

        if (inventoryData.project.length > 0) {
          const projectsPromises = inventoryData.project.map((id: number) => axiosInstance.get(`/projects/${id}`));
          const projectsResponses = await Promise.all(projectsPromises);
          setProjects(projectsResponses.map(response => response.data));
        }

        if (inventoryData.category.length > 0) {
          const categoriesPromises = inventoryData.category.map((id: number) => axiosInstance.get(`/category/${id}`));
          const categoriesResponses = await Promise.all(categoriesPromises);
          setCategories(categoriesResponses.map(response => response.data));
        }
        console.log(responsiblePerson);
        console.log(orderingPerson);
        
        
      } catch (error) {
        console.error("Error fetching inventory details:", error);
      }
    };

    fetchInventories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowId]);

  if (!inventories) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p><strong>Project:</strong> {projects.length > 0 ? projects.map(project => project.project_name).join(", ") : "Veri Yok"}</p>
      <p><strong>Category:</strong> {categories.length > 0 ? categories.map(category => category.name).join(", ") : "Veri Yok"}</p>
      <p><strong>Product Name:</strong> {inventories.product_name || "Veri Yok"}</p>
      <p><strong>Date of Purchase:</strong> {inventories.satin_alinan_tarih ? formatDate(inventories.satin_alinan_tarih) : "Veri Yok"}</p>
      <p><strong>Count:</strong> {inventories.count || "Veri Yok"}</p>
      <p><strong>Price:</strong> {inventories.price || "Veri Yok"}</p>
      <p><strong>Description:</strong> {inventories.description || "Veri Yok"}</p>
      <p><strong>Account:</strong> {inventories.account || "Veri Yok"}</p>
      <p><strong>E-commerce Site:</strong> {inventories.e_commerce_site || "Veri Yok"}</p>
      <p><strong>Company:</strong> {company ? company.company_name : "Veri Yok"}</p>
      <p><strong>Location in Office:</strong> {inventories.where_in_the_office || "Veri Yok"}</p>
      <p><strong>Responsible Person:</strong> {responsiblePerson ? responsiblePerson.username : "Veri Yok"}</p>
      <p><strong>Ordering Person:</strong> {orderingPerson.length > 0 ? orderingPerson.map(person => person.username).join(", ") : "Veri Yok"}</p>
      <p><strong>Created At:</strong> {inventories.created_at ? formatDate(inventories.created_at) : "Veri Yok"}</p>
      <p><strong>Updated At:</strong> {inventories.updated_at ? formatDate(inventories.updated_at) : "Veri Yok"}</p>
    </div>
  );
};

export default InventoryView;