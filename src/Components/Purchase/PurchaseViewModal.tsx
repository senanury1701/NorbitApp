import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface Purchase {
  id: number;
  product_name: string;
  siparis_verilen_tarih: string | null;
  deadline: string | null;
  count: number;
  price: number | null;
  description: string | null;
  account: string | null;
  e_commerce_site: string | null;
  company: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  owner: number;
  responsible_person: number;
  ordering_person: number[] | null;
  project: number[] | null;
  category: number[] | null;
}

interface Company {
  id: number;
  company_name: string;
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

interface Project {
  id: number;
  project_name: string;
}

interface Category {
  id: number;
  name: string;
}

const PurchaseViewModal = (id: any ) => {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [owner, setOwner] = useState<Employee | null>(null);
  const [responsiblePerson, setResponsiblePerson] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const response = await axiosInstance.get(`/purchase/${id.rowId}`);
        setPurchase(response.data);
      } catch (error) {
        console.log('Error fetching purchase:', error);
      }
    };

    fetchPurchase();
  }, [id]);

  useEffect(() => {
    const fetchCompany = async (companyId: number) => {
      try {
        const response = await axiosInstance.get(`/company/${companyId}`);
        setCompany(response.data);
        setCompanyError(null);
      } catch (error: any) {
        setCompany(null);
        if (error.response && error.response.status === 404) {
          setCompanyError('Company not found.');
        } else {
          setCompanyError('Failed to fetch company information.');
        }
      }
    };

    if (purchase?.company) {
      fetchCompany(Number(purchase.company));
    }
  }, [purchase]);

  useEffect(() => {
    const fetchEmployee = async (employeeId: number, setEmployee: React.Dispatch<React.SetStateAction<Employee | null>>) => {
      try {
        const response = await axiosInstance.get(`/ems/employee/${employeeId}`);
        setEmployee(response.data);
      } catch (error: any) {
        console.log('Error fetching employee:', error);
      }
    };

    if (purchase?.owner) {
      fetchEmployee(purchase.owner, setOwner);
    }

    if (purchase?.responsible_person) {
      fetchEmployee(purchase.responsible_person, setResponsiblePerson);
    }

  }, [purchase]);

  useEffect(() => {
    const fetchEmployees = async (employeeIds: number[]) => {
      if (!employeeIds || employeeIds.length === 0) return;

      try {
        const employeePromises = employeeIds.map(async (employeeId) => {
          const response = await axiosInstance.get(`/ems/employee/${employeeId}`);
          return response.data;
        });

        const employeeData = await Promise.all(employeePromises);
        setEmployees(employeeData);
        setEmployeesError(null);
      } catch (error: any) {
        console.log('Error fetching employees:', error);
        setEmployees([]);
        if (error.response && error.response.status === 404) {
          setEmployeesError('Employees not found.');
        } else {
          setEmployeesError('Failed to fetch employees information.');
        }
      }
    };

    if (purchase?.ordering_person && purchase.ordering_person.length > 0) {
      fetchEmployees(purchase.ordering_person);
    }
  }, [purchase?.ordering_person]);

  useEffect(() => {
    const fetchProjects = async (projectIds: number[]) => {
      if (!projectIds || projectIds.length === 0) return;

      try {
        const projectPromises = projectIds.map(async (projectId) => {
          const response = await axiosInstance.get(`/projects/${projectId}`);
          return response.data;
        });

        const projectData = await Promise.all(projectPromises);
        setProjects(projectData);
        setProjectsError(null);
      } catch (error: any) {
        console.log('Error fetching projects:', error);
        setProjects([]);
        if (error.response && error.response.status === 404) {
          setProjectsError('Projects not found.');
        } else {
          setProjectsError('Failed to fetch projects information.');
        }
      }
    };

    if (purchase?.project && purchase.project.length > 0) {
      fetchProjects(purchase.project);
    }
  }, [purchase?.project]);

  useEffect(() => {
    const fetchCategories = async (categoryIds: number[]) => {
      if (!categoryIds || categoryIds.length === 0) return;

      try {
        const categoryPromises = categoryIds.map(async (categoryId) => {
          const response = await axiosInstance.get(`/category/${categoryId}`);
          return response.data;
        });

        const categoryData = await Promise.all(categoryPromises);
        setCategories(categoryData);
        setCategoriesError(null);
      } catch (error: any) {
        console.log('Error fetching categories:', error);
        setCategories([]);
        if (error.response && error.response.status === 404) {
          setCategoriesError('Categories not found.');
        } else {
          setCategoriesError('Failed to fetch categories information.');
        }
      }
    };

    if (purchase?.category && purchase.category.length > 0) {
      fetchCategories(purchase.category);
    }
  }, [purchase?.category]);

  if (!purchase) {
    return <div>Loading purchase...</div>;
  }

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Purchase Details</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Product Name:</div>
            <div className="col-md-8">{purchase.product_name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Description:</div>
            <div className="col-md-8">{purchase.description || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Order Date:</div>
            <div className="col-md-8">{purchase.siparis_verilen_tarih || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Deadline:</div>
            <div className="col-md-8">{purchase.deadline || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Count:</div>
            <div className="col-md-8">{purchase.count}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Price:</div>
            <div className="col-md-8">{purchase.price || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Account:</div>
            <div className="col-md-8">{purchase.account || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">E-commerce Site:</div>
            <div className="col-md-8">{purchase.e_commerce_site || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Company:</div>
            <div className="col-md-8">
              {company ? company.company_name : companyError || 'Loading company information...'}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Status:</div>
            <div className="col-md-8">{purchase.status}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Owner:</div>
            <div className="col-md-8">
              {owner ? (
                <>
                  <div>{owner.username}</div>
                  <div>{owner.first_name} {owner.last_name}</div>
                </>
              ) : (
                'Loading owner...'
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Responsible Person:</div>
            <div className="col-md-8">
              {responsiblePerson ? (
                <>
                  <div>{responsiblePerson.username}</div>
                  <div>{responsiblePerson.first_name} {responsiblePerson.last_name}</div>
                </>
              ) : (
                'Loading responsible person...'
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Employees:</div>
            <div className="col-md-8">
              {employees.length > 0 ? (
                <ul className="list-unstyled">
                  {employees.map((employee) => (
                    <li key={employee.id}>
                      {employee.username} {employee.first_name} {employee.last_name}
                    </li>
                  ))}
                </ul>
              ) : (
                employeesError || 'Loading employees information...'
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Projects:</div>
            <div className="col-md-8">
              {projects.length > 0 ? (
                <ul className="list-unstyled">
                  {projects.map((project) => (
                    <li key={project.id}>{project.project_name}</li>
                  ))}
                </ul>
              ) : (
                projectsError || 'Loading projects information...'
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Categories:</div>
            <div className="col-md-8">
              {categories.length > 0 ? (
                <ul className="list-unstyled">
                  {categories.map((category) => (
                    <li key={category.id}>{category.name}</li>
                  ))}
                </ul>
              ) : (
                categoriesError || 'Loading categories information...'
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Created At:</div>
            <div className="col-md-8">
              {new Date(purchase.created_at).toLocaleString()}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Updated At:</div>
            <div className="col-md-8">
              {new Date(purchase.updated_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseViewModal;
