import { DataSource } from 'typeorm';
import { Vendor } from '../../vendors/entity/vendor.entity';

export async function seedVendors(dataSource: DataSource) {
  const vendorRepository = dataSource.getRepository(Vendor);

  // Check if vendors already exist
  const existingVendors = await vendorRepository.count();
  if (existingVendors > 0) {
    console.log('Vendors already exist, skipping seed');
    return;
  }

  const vendorsData = [
    // European Vendors
    {
      name: 'EuroTech Solutions',
      countries_supported: ['Germany', 'France', 'Netherlands', 'Belgium'],
      services_offered: [
        'IT Consulting',
        'Software Development',
        'Cloud Migration',
      ],
      rating: 4.8,
      response_sla_hours: 8,
    },
    {
      name: 'Nordic Business Partners',
      countries_supported: ['Sweden', 'Norway', 'Denmark', 'Finland'],
      services_offered: ['Market Research', 'Legal Services', 'HR Consulting'],
      rating: 4.6,
      response_sla_hours: 12,
    },
    {
      name: 'Mediterranean Ventures',
      countries_supported: ['Spain', 'Italy', 'Portugal', 'Greece'],
      services_offered: ['Marketing', 'Sales Support', 'Customer Service'],
      rating: 4.2,
      response_sla_hours: 16,
    },

    // Asian Vendors
    {
      name: 'Asia Pacific Tech',
      countries_supported: ['Japan', 'South Korea', 'Singapore', 'Hong Kong'],
      services_offered: [
        'Software Development',
        'IT Consulting',
        'Data Analytics',
      ],
      rating: 4.9,
      response_sla_hours: 6,
    },
    {
      name: 'Southeast Asia Partners',
      countries_supported: ['Thailand', 'Malaysia', 'Philippines', 'Vietnam'],
      services_offered: ['Manufacturing', 'Supply Chain', 'Quality Assurance'],
      rating: 4.1,
      response_sla_hours: 24,
    },
    {
      name: 'India Business Hub',
      countries_supported: ['India'],
      services_offered: [
        'Software Development',
        'Customer Service',
        'Data Analytics',
        'IT Consulting',
      ],
      rating: 4.4,
      response_sla_hours: 10,
    },

    // American Vendors
    {
      name: 'North America Solutions',
      countries_supported: ['United States', 'Canada', 'Mexico'],
      services_offered: ['Legal Services', 'HR Consulting', 'Marketing'],
      rating: 4.7,
      response_sla_hours: 8,
    },
    {
      name: 'Latin America Connect',
      countries_supported: ['Brazil', 'Argentina', 'Chile', 'Colombia'],
      services_offered: [
        'Market Research',
        'Sales Support',
        'Customer Service',
      ],
      rating: 4.0,
      response_sla_hours: 20,
    },

    // African & Middle Eastern Vendors
    {
      name: 'MENA Business Solutions',
      countries_supported: ['UAE', 'Saudi Arabia', 'Egypt', 'Jordan'],
      services_offered: ['Legal Services', 'Market Research', 'HR Consulting'],
      rating: 4.3,
      response_sla_hours: 14,
    },
    {
      name: 'African Growth Partners',
      countries_supported: ['South Africa', 'Nigeria', 'Kenya', 'Ghana'],
      services_offered: ['Manufacturing', 'Supply Chain', 'Market Research'],
      rating: 3.9,
      response_sla_hours: 18,
    },

    // Multi-region Vendors
    {
      name: 'Global Tech Innovators',
      countries_supported: [
        'United States',
        'Germany',
        'Japan',
        'Singapore',
        'Australia',
      ],
      services_offered: [
        'Software Development',
        'Cloud Migration',
        'Data Analytics',
        'IT Consulting',
      ],
      rating: 4.9,
      response_sla_hours: 4,
    },
    {
      name: 'Worldwide Marketing Pro',
      countries_supported: [
        'United Kingdom',
        'France',
        'Spain',
        'Italy',
        'Netherlands',
        'Canada',
      ],
      services_offered: ['Marketing', 'Sales Support', 'Customer Service'],
      rating: 4.5,
      response_sla_hours: 12,
    },
    {
      name: 'International Legal Experts',
      countries_supported: [
        'United States',
        'United Kingdom',
        'Germany',
        'France',
        'Australia',
        'Canada',
      ],
      services_offered: ['Legal Services', 'HR Consulting'],
      rating: 4.8,
      response_sla_hours: 6,
    },
    {
      name: 'Asia-Europe Bridge',
      countries_supported: [
        'Germany',
        'France',
        'Japan',
        'South Korea',
        'Singapore',
      ],
      services_offered: ['Market Research', 'Legal Services', 'IT Consulting'],
      rating: 4.6,
      response_sla_hours: 10,
    },
    {
      name: 'Emerging Markets Specialist',
      countries_supported: [
        'Brazil',
        'India',
        'South Africa',
        'Mexico',
        'Thailand',
      ],
      services_offered: [
        'Manufacturing',
        'Supply Chain',
        'Quality Assurance',
        'Market Research',
      ],
      rating: 4.2,
      response_sla_hours: 16,
    },
  ];

  const vendors = vendorRepository.create(vendorsData);
  await vendorRepository.save(vendors);

  console.log(`${vendorsData.length} vendors seeded successfully`);
}
