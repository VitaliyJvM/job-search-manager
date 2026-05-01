import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import Dashboard from '../pages/Dashboard.tsx';
import Companies from '../pages/Companies.tsx';
import Applications from '../pages/Applications.tsx';
import Contacts from '../pages/Contacts.tsx';
import Conversations from '../pages/Conversations.tsx';
import PromptLibrary from '../pages/PromptLibrary.tsx';
import ResumeTailoring from '../pages/ResumeTailoring.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'companies', element: <Companies /> },
      { path: 'applications', element: <Applications /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'conversations', element: <Conversations /> },
      { path: 'prompts', element: <PromptLibrary /> },
      { path: 'resume-tailoring', element: <ResumeTailoring /> },
    ],
  },
]);
