import { Topic } from '@/types';

export const topics: Topic[] = [
  {
    id: 'speichersysteme',
    name: 'Speichersysteme & Backup',
    description: 'RAID-Level, NAS/SAN, Datensicherung, 3-2-1-Regel, GFS-Prinzip',
    icon: '💾',
    color: 'bg-blue-500',
    cardCount: 35,
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    description: 'IaaS, PaaS, SaaS, Bereitstellungsmodelle, NIST-Merkmale, Workloads',
    icon: '☁️',
    color: 'bg-purple-500',
    cardCount: 32,
  },
  {
    id: 'virtualisierung',
    name: 'Virtualisierung & Container',
    description: 'Hypervisor Type 1/2, Docker, Container vs VMs, Dockerfile',
    icon: '🐳',
    color: 'bg-cyan-500',
    cardCount: 40,
  },
];
