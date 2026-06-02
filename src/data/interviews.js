export const interviewRounds = [
  { id: 'R1', name: '1st Round', color: 'blue' },
  { id: 'R2', name: '2nd Round', color: 'teal' },
  { id: 'FINAL', name: 'Final', color: 'purple' },
  { id: 'HR', name: 'HR', color: 'amber' },
]

export const interviews = [
  { id: 'iv-1', candidate: 'Aarav Mehta', candidateId: 'c-1001', role: 'SAP FICO Consultant', client: 'Cognizant', round: 'R1', date: '2026-06-02', time: '10:30', mode: 'Online', interviewer: 'Suresh Babu', feedback: 'Pending' },
  { id: 'iv-2', candidate: 'Ananya Reddy', candidateId: 'c-1006', role: 'SAP MM Consultant', client: 'IBM', round: 'R2', date: '2026-06-03', time: '14:00', mode: 'F2F', interviewer: 'Mohan Krishnan', feedback: 'Passed' },
  { id: 'iv-3', candidate: 'Vikram Singh', candidateId: 'c-1005', role: 'Cybersecurity Analyst', client: 'Accenture', round: 'FINAL', date: '2026-06-04', time: '11:00', mode: 'Online', interviewer: 'Roshni Khatri', feedback: 'Pending' },
  { id: 'iv-4', candidate: 'Sneha Pillai', candidateId: 'c-1014', role: 'Salesforce Developer', client: 'IBM', round: 'HR', date: '2026-06-05', time: '16:00', mode: 'Online', interviewer: 'Mohan Krishnan', feedback: 'On Hold' },
  { id: 'iv-5', candidate: 'Riya Saxena', candidateId: 'c-1020', role: 'SOC Analyst L2', client: 'Infosys', round: 'R1', date: '2026-06-06', time: '09:30', mode: 'Online', interviewer: 'Lakshmi Narayan', feedback: 'Passed' },
  { id: 'iv-6', candidate: 'Karan Joshi', candidateId: 'c-1007', role: 'AWS DevOps Engineer', client: 'Wipro', round: 'R2', date: '2026-06-08', time: '15:00', mode: 'F2F', interviewer: 'Kavita Rangan', feedback: 'Pending' },
  { id: 'iv-7', candidate: 'Divya Nair', candidateId: 'c-1008', role: 'Salesforce Admin', client: 'Cognizant', round: 'FINAL', date: '2026-06-09', time: '12:00', mode: 'Online', interviewer: 'Suresh Babu', feedback: 'Passed' },
  { id: 'iv-8', candidate: 'Aditya Bose', candidateId: 'c-1015', role: 'Cybersecurity Analyst', client: 'Cognizant', round: 'R1', date: '2026-06-10', time: '10:00', mode: 'Online', interviewer: 'Suresh Babu', feedback: 'Pending' },
  { id: 'iv-9', candidate: 'Pooja Verma', candidateId: 'c-1010', role: 'SOC Analyst L2', client: 'Deloitte', round: 'HR', date: '2026-06-11', time: '17:00', mode: 'Online', interviewer: 'Vikas Malhotra', feedback: 'Passed' },
  { id: 'iv-10', candidate: 'Meera Gupta', candidateId: 'c-1012', role: 'SAP FICO Consultant', client: 'Accenture', round: 'R2', date: '2026-06-12', time: '13:30', mode: 'F2F', interviewer: 'Roshni Khatri', feedback: 'Rejected' },
  { id: 'iv-11', candidate: 'Tanvi Desai', candidateId: 'c-1018', role: 'Java Microservices Lead', client: 'Accenture', round: 'R1', date: '2026-06-13', time: '11:30', mode: 'Online', interviewer: 'Roshni Khatri', feedback: 'Pending' },
  { id: 'iv-12', candidate: 'Kavya Menon', candidateId: 'c-1016', role: 'AWS Solutions Architect', client: 'Deloitte', round: 'R1', date: '2026-06-15', time: '14:30', mode: 'Online', interviewer: 'Vikas Malhotra', feedback: 'Pending' },
]

export const recentActivity = [
  { id: 'act-1', kind: 'joined', who: 'Arjun Kapoor', detail: 'joined Infosys as Java Full Stack', time: '2 hours ago' },
  { id: 'act-2', kind: 'offer', who: 'Divya Nair', detail: 'received an offer from Cognizant', time: '5 hours ago' },
  { id: 'act-3', kind: 'interview', who: 'Ananya Reddy', detail: 'cleared R2 with IBM', time: '1 day ago' },
  { id: 'act-4', kind: 'interview', who: 'Vikram Singh', detail: 'Final round scheduled with Accenture', time: '1 day ago' },
  { id: 'act-5', kind: 'joined', who: 'Rajesh Kumar', detail: 'joined TCS as SAP BW Lead', time: '2 days ago' },
  { id: 'act-6', kind: 'rejected', who: 'Manish Yadav', detail: 'rejected by Wipro at HR round', time: '3 days ago' },
  { id: 'act-7', kind: 'offer', who: 'Aditya Bose', detail: 'received an offer from Cognizant', time: '3 days ago' },
  { id: 'act-8', kind: 'sourced', who: 'Kavya Menon', detail: 'added to the AWS pipeline', time: '4 days ago' },
]

export const revenueSplit = [
  { name: 'Staffing', value: 62 },
  { name: 'Consulting', value: 26 },
  { name: 'Training', value: 12 },
]
