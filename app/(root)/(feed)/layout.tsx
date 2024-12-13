import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterBar from '@/components/navbars/FilterBar';
import { FeedNavbar } from '@/components/navbars/FeedNavBar';

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex flex-col min-h-screen">
			<FeedNavbar />
			<div className="flex flex-row pt-16">
				<FilterBar />
				<div className="flex-1 ml-64 p-6">{children}</div>
			</div>
			<ToastContainer />
		</main>
	);
};

export default FeedLayout;
