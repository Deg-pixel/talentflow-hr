export const STAGES = [
  { id: 'sourced', name: 'Sourced', color: 'slate' },
  { id: 'screening', name: 'Screening', color: 'amber' },
  { id: 'interview', name: 'Interview Scheduled', color: 'blue' },
  { id: 'offer', name: 'Offer Sent', color: 'purple' },
  { id: 'joined', name: 'Joined', color: 'teal' },
  { id: 'rejected', name: 'Rejected', color: 'rose' },
]

export const candidates = [
  { id: 'c-1001', name: 'Aarav Mehta', tech: 'SAP', experience: 6, client: 'Cognizant', stage: 'sourced', email: 'aarav.mehta@mail.com', phone: '+91 98765 11001', avatar: 'AM', location: 'Bengaluru', expectedCtc: '24 LPA', source: 'LinkedIn' },
  { id: 'c-1002', name: 'Priya Sharma', tech: 'AWS', experience: 4, client: 'Infosys', stage: 'sourced', email: 'priya.s@mail.com', phone: '+91 98765 11002', avatar: 'PS', location: 'Pune', expectedCtc: '18 LPA', source: 'Portal' },
  { id: 'c-1003', name: 'Rohan Patel', tech: 'Salesforce', experience: 8, client: 'Deloitte', stage: 'screening', email: 'rohan.p@mail.com', phone: '+91 98765 11003', avatar: 'RP', location: 'Hyderabad', expectedCtc: '30 LPA', source: 'Referral' },
  { id: 'c-1004', name: 'Neha Iyer', tech: 'Java', experience: 5, client: 'TCS', stage: 'screening', email: 'neha.i@mail.com', phone: '+91 98765 11004', avatar: 'NI', location: 'Chennai', expectedCtc: '20 LPA', source: 'LinkedIn' },
  { id: 'c-1005', name: 'Vikram Singh', tech: 'Cybersecurity', experience: 7, client: 'Accenture', stage: 'interview', email: 'vikram.s@mail.com', phone: '+91 98765 11005', avatar: 'VS', location: 'Gurgaon', expectedCtc: '28 LPA', source: 'Internal DB' },
  { id: 'c-1006', name: 'Ananya Reddy', tech: 'SAP', experience: 9, client: 'IBM', stage: 'interview', email: 'ananya.r@mail.com', phone: '+91 98765 11006', avatar: 'AR', location: 'Bengaluru', expectedCtc: '34 LPA', source: 'LinkedIn' },
  { id: 'c-1007', name: 'Karan Joshi', tech: 'AWS', experience: 3, client: 'Wipro', stage: 'offer', email: 'karan.j@mail.com', phone: '+91 98765 11007', avatar: 'KJ', location: 'Mumbai', expectedCtc: '15 LPA', source: 'Portal' },
  { id: 'c-1008', name: 'Divya Nair', tech: 'Salesforce', experience: 6, client: 'Cognizant', stage: 'offer', email: 'divya.n@mail.com', phone: '+91 98765 11008', avatar: 'DN', location: 'Kochi', expectedCtc: '23 LPA', source: 'Referral' },
  { id: 'c-1009', name: 'Arjun Kapoor', tech: 'Java', experience: 10, client: 'Infosys', stage: 'joined', email: 'arjun.k@mail.com', phone: '+91 98765 11009', avatar: 'AK', location: 'Noida', expectedCtc: '38 LPA', source: 'Internal DB' },
  { id: 'c-1010', name: 'Pooja Verma', tech: 'Cybersecurity', experience: 5, client: 'Deloitte', stage: 'joined', email: 'pooja.v@mail.com', phone: '+91 98765 11010', avatar: 'PV', location: 'Pune', expectedCtc: '22 LPA', source: 'LinkedIn' },
  { id: 'c-1011', name: 'Sandeep Rao', tech: 'AWS', experience: 4, client: 'TCS', stage: 'rejected', email: 'sandeep.r@mail.com', phone: '+91 98765 11011', avatar: 'SR', location: 'Bengaluru', expectedCtc: '17 LPA', source: 'Portal' },
  { id: 'c-1012', name: 'Meera Gupta', tech: 'SAP', experience: 5, client: 'Accenture', stage: 'screening', email: 'meera.g@mail.com', phone: '+91 98765 11012', avatar: 'MG', location: 'Hyderabad', expectedCtc: '21 LPA', source: 'LinkedIn' },
  { id: 'c-1013', name: 'Rahul Khanna', tech: 'Java', experience: 2, client: 'Wipro', stage: 'sourced', email: 'rahul.k@mail.com', phone: '+91 98765 11013', avatar: 'RK', location: 'Bengaluru', expectedCtc: '11 LPA', source: 'Portal' },
  { id: 'c-1014', name: 'Sneha Pillai', tech: 'Salesforce', experience: 7, client: 'IBM', stage: 'interview', email: 'sneha.p@mail.com', phone: '+91 98765 11014', avatar: 'SP', location: 'Chennai', expectedCtc: '27 LPA', source: 'Referral' },
  { id: 'c-1015', name: 'Aditya Bose', tech: 'Cybersecurity', experience: 8, client: 'Cognizant', stage: 'offer', email: 'aditya.b@mail.com', phone: '+91 98765 11015', avatar: 'AB', location: 'Kolkata', expectedCtc: '32 LPA', source: 'LinkedIn' },
  { id: 'c-1016', name: 'Kavya Menon', tech: 'AWS', experience: 6, client: 'Deloitte', stage: 'sourced', email: 'kavya.m@mail.com', phone: '+91 98765 11016', avatar: 'KM', location: 'Kochi', expectedCtc: '25 LPA', source: 'LinkedIn' },
  { id: 'c-1017', name: 'Rajesh Kumar', tech: 'SAP', experience: 11, client: 'TCS', stage: 'joined', email: 'rajesh.k@mail.com', phone: '+91 98765 11017', avatar: 'RK', location: 'Mumbai', expectedCtc: '42 LPA', source: 'Internal DB' },
  { id: 'c-1018', name: 'Tanvi Desai', tech: 'Java', experience: 4, client: 'Accenture', stage: 'screening', email: 'tanvi.d@mail.com', phone: '+91 98765 11018', avatar: 'TD', location: 'Pune', expectedCtc: '19 LPA', source: 'Portal' },
  { id: 'c-1019', name: 'Manish Yadav', tech: 'Salesforce', experience: 3, client: 'Wipro', stage: 'rejected', email: 'manish.y@mail.com', phone: '+91 98765 11019', avatar: 'MY', location: 'Noida', expectedCtc: '14 LPA', source: 'Portal' },
  { id: 'c-1020', name: 'Riya Saxena', tech: 'Cybersecurity', experience: 6, client: 'Infosys', stage: 'interview', email: 'riya.s@mail.com', phone: '+91 98765 11020', avatar: 'RS', location: 'Bengaluru', expectedCtc: '26 LPA', source: 'LinkedIn' },
]

export const techStacks = ['SAP', 'AWS', 'Salesforce', 'Java', 'Cybersecurity']

export const candidateSources = [
  { name: 'LinkedIn', value: 38 },
  { name: 'Portal', value: 24 },
  { name: 'Referral', value: 18 },
  { name: 'Internal Database', value: 20 },
]

export const candidatesByTech = [
  { name: 'SAP', value: 28 },
  { name: 'AWS', value: 22 },
  { name: 'Salesforce', value: 18 },
  { name: 'Java', value: 24 },
  { name: 'Cybersecurity', value: 16 },
]
