import { connect, connection, Model } from 'mongoose';
import {
  DocumentEntity,
  DocumentSchema,
} from '../../documents/schemas/document.schema';

export async function seedDocuments() {
  console.log('🌱 Seeding MongoDB documents...');

  // Connect to MongoDB
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/expanders360_docs';
  await connect(mongoUri);

  const DocumentModel: Model<DocumentEntity> = connection.model(
    'DocumentEntity',
    DocumentSchema,
  );

  // Check if documents already exist
  const existingDocs = await DocumentModel.countDocuments();
  if (existingDocs > 0) {
    console.log('Documents already exist, skipping seed');
    await connection.close();
    return;
  }

  const sampleDocuments = [
    // Germany expansion documents
    {
      projectId: '1', // Will be linked to Germany expansion project
      title: 'Germany Market Research Report 2024',
      content:
        'Comprehensive market analysis for German expansion including consumer behavior, market size, competition landscape, and regulatory requirements. Key findings indicate strong growth potential in the tech sector with favorable government incentives for foreign investment.',
      tags: ['market-research', 'germany', 'expansion', 'analysis'],
      fileName: 'germany-market-research.pdf',
      filePath: '/uploads/documents/germany-market-research.pdf',
      fileSize: 2048576,
      mimeType: 'application/pdf',
    },
    {
      projectId: '1',
      title: 'Legal Requirements for Germany Business Setup',
      content:
        'Detailed guide on legal requirements for establishing business operations in Germany including company registration, tax obligations, employment law, and compliance requirements.',
      tags: ['legal', 'germany', 'compliance', 'business-setup'],
      fileName: 'germany-legal-requirements.pdf',
      filePath: '/uploads/documents/germany-legal-requirements.pdf',
      fileSize: 1536000,
      mimeType: 'application/pdf',
    },
    {
      projectId: '1',
      title: 'Germany Tax Structure and Benefits',
      content:
        'Analysis of German tax structure, available benefits for foreign companies, and optimization strategies for tax efficiency.',
      tags: ['tax', 'germany', 'financial', 'benefits'],
      fileName: 'germany-tax-guide.xlsx',
      filePath: '/uploads/documents/germany-tax-guide.xlsx',
      fileSize: 512000,
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },

    // France expansion documents
    {
      projectId: '2', // Will be linked to France expansion project
      title: 'France Competitive Landscape Analysis',
      content:
        'In-depth competitive analysis of the French market including key players, market positioning, pricing strategies, and competitive advantages.',
      tags: ['competitor-analysis', 'france', 'market-study'],
      fileName: 'france-competitor-analysis.pdf',
      filePath: '/uploads/documents/france-competitor-analysis.pdf',
      fileSize: 3072000,
      mimeType: 'application/pdf',
    },
    {
      projectId: '2',
      title: 'French Business Culture and Practices',
      content:
        'Guide to French business culture, communication styles, meeting etiquette, and relationship building practices for successful market entry.',
      tags: ['culture', 'france', 'business-practices', 'guide'],
      fileName: 'france-cultural-guide.docx',
      filePath: '/uploads/documents/france-cultural-guide.docx',
      fileSize: 768000,
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },

    // UK expansion documents
    {
      projectId: '3', // Will be linked to UK expansion project
      title: 'Brexit Impact on UK Business Operations',
      content:
        'Analysis of Brexit implications for business operations in the UK including trade regulations, visa requirements, and operational changes.',
      tags: ['brexit', 'uk', 'impact-analysis', 'operations'],
      fileName: 'uk-brexit-impact.pdf',
      filePath: '/uploads/documents/uk-brexit-impact.pdf',
      fileSize: 1792000,
      mimeType: 'application/pdf',
    },
    {
      projectId: '3',
      title: 'UK Market Entry Strategy Presentation',
      content:
        'Strategic presentation outlining market entry approach for the UK including target segments, go-to-market strategy, and success metrics.',
      tags: ['strategy', 'uk', 'market-entry', 'presentation'],
      fileName: 'uk-market-entry-strategy.pptx',
      filePath: '/uploads/documents/uk-market-entry-strategy.pptx',
      fileSize: 2560000,
      mimeType:
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    },

    // Spain expansion documents
    {
      projectId: '4', // Will be linked to Spain expansion project
      title: 'Spain Regulatory Framework for Tech Companies',
      content:
        'Comprehensive overview of regulatory requirements for technology companies operating in Spain including data protection, digital services, and industry-specific regulations.',
      tags: ['regulatory', 'spain', 'tech', 'compliance'],
      fileName: 'spain-regulatory-framework.pdf',
      filePath: '/uploads/documents/spain-regulatory-framework.pdf',
      fileSize: 2304000,
      mimeType: 'application/pdf',
    },

    // Italy expansion documents
    {
      projectId: '5', // Will be linked to Italy expansion project
      title: 'Italy Local Partnership Opportunities',
      content:
        'Analysis of potential local partnerships in Italy including strategic partners, distribution channels, and joint venture opportunities.',
      tags: ['partnerships', 'italy', 'opportunities', 'local'],
      fileName: 'italy-partnership-opportunities.pdf',
      filePath: '/uploads/documents/italy-partnership-opportunities.pdf',
      fileSize: 1280000,
      mimeType: 'application/pdf',
    },

    // Netherlands expansion documents
    {
      projectId: '6', // Will be linked to Netherlands expansion project
      title: 'Netherlands Startup Ecosystem Overview',
      content:
        'Overview of the Dutch startup ecosystem including funding opportunities, incubators, government support programs, and networking events.',
      tags: ['startup', 'netherlands', 'ecosystem', 'overview'],
      fileName: 'netherlands-startup-ecosystem.pdf',
      filePath: '/uploads/documents/netherlands-startup-ecosystem.pdf',
      fileSize: 1920000,
      mimeType: 'application/pdf',
    },

    // General expansion documents
    {
      projectId: '1',
      title: 'European Union Expansion Checklist',
      content:
        'Comprehensive checklist for expanding into EU markets including regulatory compliance, market research, legal requirements, and operational setup.',
      tags: ['checklist', 'eu', 'expansion', 'general'],
      fileName: 'eu-expansion-checklist.xlsx',
      filePath: '/uploads/documents/eu-expansion-checklist.xlsx',
      fileSize: 384000,
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    {
      projectId: '2',
      title: 'Global Expansion Best Practices Guide',
      content:
        'Best practices guide for global expansion including strategic planning, risk management, cultural considerations, and success metrics.',
      tags: ['best-practices', 'global', 'expansion', 'guide'],
      fileName: 'global-expansion-best-practices.pdf',
      filePath: '/uploads/documents/global-expansion-best-practices.pdf',
      fileSize: 2816000,
      mimeType: 'application/pdf',
    },
  ];

  const createdDocuments = await DocumentModel.insertMany(sampleDocuments);
  console.log(`✅ Created ${createdDocuments.length} sample documents`);

  // Create search indexes for better performance
  await createSearchIndexes(DocumentModel);

  await connection.close();
  return createdDocuments;
}

async function createSearchIndexes(DocumentModel: Model<DocumentEntity>) {
  try {
    // Create text index for search functionality
    await DocumentModel.collection.createIndex({
      title: 'text',
      content: 'text',
      tags: 'text',
    });

    // Create compound indexes for common queries
    await DocumentModel.collection.createIndex({
      projectId: 1,
      createdAt: -1,
    });
    await DocumentModel.collection.createIndex({ tags: 1 });

    console.log('✅ Created MongoDB search indexes');
  } catch (error) {
    console.log('ℹ️ Search indexes may already exist');
  }
}
