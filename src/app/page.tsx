"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardPage from '../components/DashboardPage';
import ServicesPage from '../components/ServicesPage';
import ServiceDetailPage from '../components/ServiceDetailPage';
import UXFlowsPage from '../components/UXFlowsPage';
import UXFlowDetailPage from '../components/UXFlowDetailPage';
import ReportsPage from '../components/ReportsPage';
import GenerateReportModal from '../components/GenerateReportModal';
import Sidebar from '../components/Sidebar';
import CommandBar from '../components/CommandBar';
import { initialServicesData, uxFlowsData } from '../data/mockData';
import { fetchServices } from '../data/fetchServices';
import '../index.css';

export default function Home() {
    const [services, setServices] = useState(initialServicesData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedId, setSelectedId] = useState<number | string | null>(null);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [isCommandBarOpen, setCommandBarOpen] = useState(false);

    useEffect(() => {
        // UI listeners
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        handleResize();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandBarOpen(open => !open);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        // Fetch services from DB/API
        fetchServices()
            .then(data => {
                setServices(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load services.');
                setLoading(false);
            });
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleNavigate = (page: string, id: number | string | null = null) => {
        setCurrentPage(page);
        setSelectedId(id);
        setCommandBarOpen(false);
    };

    const renderContent = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage onNavigate={handleNavigate} />;
            case 'services':
                return <ServicesPage onNavigate={handleNavigate} services={services} loading={loading} error={error} />;
            case 'service-detail':
                if (selectedId) {
                    if (loading) return <div className="text-gray-400 p-8">Loading...</div>;
                    if (error) return <div className="text-red-400 p-8">{error}</div>;
                    const service = services.find(s => s.id === selectedId);
                    if (!service) return <div className="text-red-400 p-8">Service not found.</div>;
                    return <ServiceDetailPage service={service} onBack={() => handleNavigate('services')} />;
                }
                break;
            case 'ux-flows':
                return <UXFlowsPage onNavigate={handleNavigate} />;
            case 'ux-flow-detail':
                if (selectedId) {
                    const flow = uxFlowsData.find(f => f.id === selectedId);
                    if (!flow) return <div className="text-red-400 p-8">UX Flow not found.</div>;
                    return <UXFlowDetailPage flow={flow} onBack={() => handleNavigate('ux-flows')} />;
                }
                break;
            case 'reports':
                return <ReportsPage onGenerateReport={() => setReportModalOpen(true)} />;
            default:
                return <DashboardPage onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
                <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full bg-purple-500/10 blur-3xl animate-pulse animation-delay-4000"></div>
            </div>
            <Sidebar isSidebarOpen={isSidebarOpen} currentPage={currentPage} onNavigate={handleNavigate} />
            <main className={`transition-all duration-300 relative z-10 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="p-8">{renderContent()}</div>
            </main>
            <AnimatePresence>
                {isReportModalOpen && <GenerateReportModal onClose={() => setReportModalOpen(false)} />}
                {isCommandBarOpen && <CommandBar onClose={() => setCommandBarOpen(false)} onNavigate={handleNavigate} />}
            </AnimatePresence>
        </div>
    );
}
