import { RootNavbar } from '@/components/navbars/RootNavbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterBar from '@/components/navbars/FilterBar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex flex-col min-h-screen">
			<RootNavbar />
			<div className="flex flex-row flex-1 pt-16">
				<FilterBar />
				<div className="flex-1">
					{children}
				</div>
			</div>
			<ToastContainer />
		</main>
	);
};

export default RootLayout;
