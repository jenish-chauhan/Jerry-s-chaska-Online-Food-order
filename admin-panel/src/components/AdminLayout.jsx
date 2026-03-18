import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{
                marginLeft: 'var(--sidebar-width)',
                flex: 1,
                background: 'var(--bg)',
                minHeight: '100vh',
                overflow: 'auto',
            }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
