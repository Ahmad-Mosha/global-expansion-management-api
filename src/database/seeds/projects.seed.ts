import { DataSource } from 'typeorm';
import { Project, ProjectStatus } from '../../projects/entity/project.entity';
import { Client } from '../../clients/entity/clients.entity';

export async function seedProjects(dataSource: DataSource) {
  const projectRepository = dataSource.getRepository(Project);
  const clientRepository = dataSource.getRepository(Client);

  // Check if projects already exist
  const existingProjects = await projectRepository.count();
  if (existingProjects > 0) {
    console.log('Projects already exist, skipping seed');
    return;
  }

  // Get all clients
  const clients = await clientRepository.find();
  if (clients.length === 0) {
    console.log('No clients found, please seed clients first');
    return;
  }

  const projectsData = [
    // TechCorp Industries projects
    {
      client_index: 0,
      country: 'Germany',
      services_needed: ['IT Consulting', 'Software Development'],
      budget: 150000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 0,
      country: 'Japan',
      services_needed: ['Software Development', 'Data Analytics'],
      budget: 200000,
      status: ProjectStatus.ACTIVE,
    },

    // Global Retail Solutions projects
    {
      client_index: 1,
      country: 'Spain',
      services_needed: ['Marketing', 'Sales Support'],
      budget: 80000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 1,
      country: 'Brazil',
      services_needed: ['Market Research', 'Customer Service'],
      budget: 120000,
      status: ProjectStatus.COMPLETED,
    },

    // InnovateSoft Ltd projects
    {
      client_index: 2,
      country: 'Singapore',
      services_needed: ['Software Development', 'Cloud Migration'],
      budget: 300000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 2,
      country: 'Netherlands',
      services_needed: ['IT Consulting', 'Data Analytics'],
      budget: 180000,
      status: ProjectStatus.ACTIVE,
    },

    // HealthPlus Medical projects
    {
      client_index: 3,
      country: 'Canada',
      services_needed: ['Legal Services', 'HR Consulting'],
      budget: 90000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 3,
      country: 'United Kingdom',
      services_needed: ['Market Research', 'Legal Services'],
      budget: 110000,
      status: ProjectStatus.PAUSED,
    },

    // Finance Group International projects
    {
      client_index: 4,
      country: 'UAE',
      services_needed: ['Legal Services', 'HR Consulting'],
      budget: 250000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 4,
      country: 'South Africa',
      services_needed: ['Market Research', 'Legal Services'],
      budget: 75000,
      status: ProjectStatus.ACTIVE,
    },

    // AutoParts Europe GmbH projects
    {
      client_index: 5,
      country: 'France',
      services_needed: ['Manufacturing', 'Supply Chain'],
      budget: 400000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 5,
      country: 'Italy',
      services_needed: ['Quality Assurance', 'Supply Chain'],
      budget: 220000,
      status: ProjectStatus.ACTIVE,
    },

    // Tanaka Manufacturing Co projects
    {
      client_index: 6,
      country: 'Thailand',
      services_needed: ['Manufacturing', 'Quality Assurance'],
      budget: 180000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 6,
      country: 'Vietnam',
      services_needed: ['Supply Chain', 'Manufacturing'],
      budget: 160000,
      status: ProjectStatus.COMPLETED,
    },

    // E-Commerce Solutions UK projects
    {
      client_index: 7,
      country: 'Germany',
      services_needed: ['Marketing', 'Customer Service'],
      budget: 95000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 7,
      country: 'France',
      services_needed: ['Sales Support', 'Marketing'],
      budget: 85000,
      status: ProjectStatus.ACTIVE,
    },

    // Rodriguez Logistics projects
    {
      client_index: 8,
      country: 'Colombia',
      services_needed: ['Supply Chain', 'Market Research'],
      budget: 130000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 8,
      country: 'Chile',
      services_needed: ['Manufacturing', 'Supply Chain'],
      budget: 170000,
      status: ProjectStatus.ACTIVE,
    },

    // Kowalski Consulting Group projects
    {
      client_index: 9,
      country: 'Sweden',
      services_needed: ['HR Consulting', 'Legal Services'],
      budget: 70000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 9,
      country: 'Norway',
      services_needed: ['Market Research', 'HR Consulting'],
      budget: 80000,
      status: ProjectStatus.CANCELLED,
    },

    // Additional projects for better analytics data
    {
      client_index: 0,
      country: 'United States',
      services_needed: ['Cloud Migration', 'IT Consulting'],
      budget: 350000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 1,
      country: 'Australia',
      services_needed: ['Marketing', 'Sales Support'],
      budget: 140000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client_index: 2,
      country: 'India',
      services_needed: ['Software Development', 'Customer Service'],
      budget: 100000,
      status: ProjectStatus.ACTIVE,
    },
  ];

  const projects = [];
  for (const projectData of projectsData) {
    const project = projectRepository.create({
      client_id: clients[projectData.client_index].user_id,
      country: projectData.country,
      services_needed: projectData.services_needed,
      budget: projectData.budget,
      status: projectData.status,
    });
    projects.push(project);
  }

  await projectRepository.save(projects);

  console.log(`${projectsData.length} projects seeded successfully`);
}
