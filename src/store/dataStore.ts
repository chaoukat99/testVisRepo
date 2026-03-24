import { create } from 'zustand';

export interface Company {
  id: string;
  name: string;
  email: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website?: string;
  rc?: string;
  ice?: string;
  representative?: string;
  bankReferences?: string;
  createdAt: Date;
}

export interface Consultant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  skills: string[];
  experience: number;
  rate: number;
  availability: string;
  location: string;
  bio: string;
  linkedIn?: string;
  createdAt: Date;
}

export interface Mission {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  budget: string;
  location: string;
  remote: boolean;
  startDate: string;
  createdAt: Date;
}

interface DataStore {
  companies: Company[];
  consultants: Consultant[];
  missions: Mission[];
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  addConsultant: (consultant: Omit<Consultant, 'id' | 'createdAt'>) => void;
  addMission: (mission: Omit<Mission, 'id' | 'createdAt'>) => void;
}

// Mock data
const mockConsultants: Consultant[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@email.com',
    title: 'Senior Full-Stack Developer',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
    experience: 8,
    rate: 850,
    availability: 'Immediate',
    location: 'Paris, France',
    bio: 'Experienced full-stack developer with a passion for building scalable web applications.',
    createdAt: new Date(),
  },
  {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@email.com',
    title: 'Data Science Consultant',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Tableau'],
    experience: 6,
    rate: 920,
    availability: '2 weeks',
    location: 'London, UK',
    bio: 'Data scientist specializing in ML solutions for enterprise clients.',
    createdAt: new Date(),
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Schmidt',
    email: 'emma.s@email.com',
    title: 'UX/UI Design Lead',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility'],
    experience: 10,
    rate: 780,
    availability: '1 month',
    location: 'Berlin, Germany',
    bio: 'Design leader with a focus on creating inclusive, user-centered experiences.',
    createdAt: new Date(),
  },
  {
    id: '4',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.r@email.com',
    title: 'DevOps Engineer',
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'GCP'],
    experience: 5,
    rate: 800,
    availability: 'Immediate',
    location: 'Remote',
    bio: 'DevOps specialist helping teams ship faster with reliable infrastructure.',
    createdAt: new Date(),
  },
  {
    id: '5',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.p@email.com',
    title: 'Product Manager',
    skills: ['Agile', 'Roadmapping', 'User Stories', 'Analytics', 'Stakeholder Management'],
    experience: 7,
    rate: 900,
    availability: '2 weeks',
    location: 'Amsterdam, Netherlands',
    bio: 'Product leader driving growth through data-informed decisions.',
    createdAt: new Date(),
  },
];

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    email: 'hr@techcorp.com',
    industry: 'Technology',
    size: '201-500',
    location: 'Paris, France',
    description: 'Leading enterprise software company.',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'FinanceHub',
    email: 'talent@financehub.com',
    industry: 'Finance',
    size: '501-1000',
    location: 'London, UK',
    description: 'Innovative fintech solutions provider.',
    createdAt: new Date(),
  },
];

const mockMissions: Mission[] = [
  {
    id: '1',
    companyId: '1',
    companyName: 'TechCorp Solutions',
    title: 'Senior React Developer',
    description: 'Looking for an experienced React developer to lead our frontend team.',
    skills: ['React', 'TypeScript', 'Redux', 'Testing'],
    duration: '6 months',
    budget: '€70,000 - €85,000',
    location: 'Paris, France',
    remote: true,
    startDate: '2024-02-01',
    createdAt: new Date(),
  },
  {
    id: '2',
    companyId: '2',
    companyName: 'FinanceHub',
    title: 'ML Engineer',
    description: 'Build and deploy machine learning models for fraud detection.',
    skills: ['Python', 'TensorFlow', 'MLOps', 'AWS'],
    duration: '12 months',
    budget: '€90,000 - €110,000',
    location: 'Remote',
    remote: true,
    startDate: '2024-01-15',
    createdAt: new Date(),
  },
];

export const useDataStore = create<DataStore>((set) => ({
  companies: mockCompanies,
  consultants: mockConsultants,
  missions: mockMissions,
  addCompany: (company) =>
    set((state) => ({
      companies: [
        ...state.companies,
        { ...company, id: crypto.randomUUID(), createdAt: new Date() },
      ],
    })),
  addConsultant: (consultant) =>
    set((state) => ({
      consultants: [
        ...state.consultants,
        { ...consultant, id: crypto.randomUUID(), createdAt: new Date() },
      ],
    })),
  addMission: (mission) =>
    set((state) => ({
      missions: [
        ...state.missions,
        { ...mission, id: crypto.randomUUID(), createdAt: new Date() },
      ],
    })),
}));
