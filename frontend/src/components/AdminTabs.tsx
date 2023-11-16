import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useEffect, useState } from 'react';
import { ddbGetAllProjectsWithEstimates, ddbGetAllProjectsWithEstimatesAndContractors, ddbGetAllProjectsWithoutEstimates } from '../graphql/projects';
import moment from 'moment';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ddbGetAllForms } from '../graphql/forms';
import { ddbGetAllQueryResponse } from '../types/types';
import { CreateForm } from './CreateForm';

export const AdminTabs = () => {
  const [projectsWithEstimates, setProjectsWithEstimates] = useState<ddbGetAllQueryResponse[]>([]);
  const [projectsWithEstimatesAndContractors, setProjectsWithEstimatesAndContractors] = useState<ddbGetAllQueryResponse[]>([]);
  const [projectsWithoutEstimates, setProjectsWithoutEstimates] = useState<ddbGetAllQueryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<ddbGetAllQueryResponse[]>([]);


  useEffect(() => {
    const fetchQuestions = async () => {
      const responseWithEstimates = await ddbGetAllProjectsWithEstimates();
      setProjectsWithEstimates(responseWithEstimates);

      const responseWithEstimatesandContractors = await ddbGetAllProjectsWithEstimatesAndContractors();
      setProjectsWithEstimatesAndContractors(responseWithEstimatesandContractors);

      const responseWithoutEstimates = await ddbGetAllProjectsWithoutEstimates();
      setProjectsWithoutEstimates(responseWithoutEstimates);

      const fetchForms = await ddbGetAllForms();
      setForms(fetchForms);

      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const renderProjectTab = (data: ddbGetAllQueryResponse[]) => {
    const sortedProjects = data.sort(
      (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
    );

    const cards = sortedProjects.map((project) => (
      <ProjectCard key={project.projectId} {...project} />
    ));

    return (
      <div className='text-center'>
        {!cards.length &&
          <div>
            <h1 className='my-5 text-black'>No Projects Yet</h1>
          </div>}
        {cards.map((card, index) => (
          <div key={index} className='d-flex justify-content-center my-3'>
            {card}
          </div>
        ))}
      </div>
    );
  }

  

  return (
    <Tabs
      defaultActiveKey="projectsWithEstimates"
      transition={false}
      id="noanim-tab-example"
      className="mb-3"
    >
      <Tab eventKey="projectsWithEstimates" title="Projects to Estimate">
        {loading ? (
          <div className="text-center">
            <p>Loading...</p>
            <LoadingSpinner />
          </div>
        ) : (
          renderProjectTab(projectsWithoutEstimates)
        )}
      </Tab>
      <Tab eventKey="assignContractor" title="Assign Contractor">
        {loading ? (
          <div className="text-center">
            <p>Loading...</p>
            <LoadingSpinner />
          </div>
        ) : (
          renderProjectTab(projectsWithEstimates)
        )}
      </Tab>
      <Tab eventKey="manageProjects" title="Manage Projects">
        {loading ? (
          <div className="text-center">
            <p>Loading...</p>
            <LoadingSpinner />
          </div>
        ) : (
          renderProjectTab(projectsWithEstimatesAndContractors)
        )}
      </Tab>
      <Tab eventKey="Calendar" title="Calendar">
        {loading ? (
          <div className="text-center">
            <p>Loading...</p>
            <LoadingSpinner />
          </div>
        ) : (
          <iframe className="calendar" title="calendar" src="https://calendar.google.com/calendar/embed?src=kalansestimates%40gmail.com&ctz=America%2FLos_Angeles" scrolling="no"></iframe>
        )}
      </Tab>
      <Tab eventKey="Create Form" title="Create Form">
        {loading ? (
          <div className="text-center">
            <p>Loading...</p>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <CreateForm />
          </div>
        )}
      </Tab>
    </Tabs>
  );
}

