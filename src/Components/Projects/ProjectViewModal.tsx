import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";

interface Project {
  id: number;
  project_name: string;
  created_at: string;
  updated_at: string;
}

const ProjectViewModal = (id:any) => {
  const [project, setProject] = useState<Project | null>(null);
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/project/${id.rowId}`);
        setProject(response.data); 
      } catch (error) {
        console.log("Error fetching project:", error);
        throw error;
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }



  return (
    <div >
      <p>Project Name: {project.project_name}</p>
      <p>Created At: {project.created_at}</p>
      <p>Updated At: {project.updated_at}</p>
      {/* Add other fields as needed */}
    </div>
                
  );
};

export default ProjectViewModal;
