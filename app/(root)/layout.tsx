import { RootNavbar } from '@/components/navbars/RootNavbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex flex-col min-h-screen">
			<RootNavbar />
			{children}
			<ToastContainer />
		</main>
	);
};

export default RootLayout;
