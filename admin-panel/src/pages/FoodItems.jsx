import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';

const CATEGORIES = ['Starters', 'Main Course', 'Snacks', 'Drinks', 'Desserts', 'Breakfast'];

const emptyForm = { name: '', description: '', price: '', category: '', image_url: '', available: true };

const FoodItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await getMenuItems();
            setItems(res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchItems(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setForm(emptyForm);
        setError('');
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({
            name: item.name, description: item.description || '',
            price: item.price, category: item.category,
            image_url: item.image_url || '', available: item.available !== false
        });
        setError('');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.price || !form.category) {
            setError('Name, price, and category are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload = { ...form, price: parseFloat(form.price) };
            if (editItem) {
                await updateMenuItem(editItem.id, payload);
            } else {
                await createMenuItem(payload);
            }
            setShowModal(false);
            fetchItems();
        } catch (e) {
            setError(e.message || 'Failed to save item');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await deleteMenuItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            alert('Failed to delete: ' + e.message);
        }
    };

    const filtered = items.filter(i =>
        !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Food Items</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{items.length} items in menu</p>
                    </div>
                    <button className="btn btn-primary" onClick={openAdd}>
                        <Plus size={17} /> Add Item
                    </button>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', width: 280, marginBottom: 20 }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
                        <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} className="spin" />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
                        {filtered.map(item => (
                            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                {item.image_url && (
                                    <div style={{ height: 160, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                                        <img src={item.image_url} alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { e.target.style.display = 'none'; }} />
                                    </div>
                                )}
                                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>{item.name}</h3>
                                        <span style={{
                                            fontSize: 11, padding: '2px 8px', borderRadius: 999, marginLeft: 8,
                                            background: item.available ? '#DCFCE7' : '#FEE2E2',
                                            color: item.available ? '#15803D' : '#B91C1C', fontWeight: 600
                                        }}>
                                            {item.available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg)', padding: '2px 8px', borderRadius: 6, display: 'inline-block', width: 'fit-content' }}>
                                        {item.category}
                                    </span>
                                    {item.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.description}</p>}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>₹{parseFloat(item.price).toFixed(2)}</span>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}><Pencil size={14} /></button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, item.name)}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                                No items found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">{editItem ? 'Edit Food Item' : 'Add New Item'}</span>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', color: '#B91C1C', fontSize: 13 }}>
                                    {error}
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Item Name *</label>
                                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Paneer Tikka" required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div className="form-group">
                                    <label className="form-label">Price (₹) *</label>
                                    <input className="form-input" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select className="form-input form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                                        <option value="">Select category</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." style={{ resize: 'vertical' }} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input className="form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input type="checkbox" id="available" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                                <label htmlFor="available" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>Available for ordering</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : (editItem ? 'Save Changes' : 'Add Item')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default FoodItems;
