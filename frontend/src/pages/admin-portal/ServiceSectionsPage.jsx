import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowUp, ChevronDown, ChevronUp, Filter, Layers, Pencil, Plus, Save, Search, Sparkles, Trash2 } from 'lucide-react';
import {
  createSection,
  createSectionItem,
  deleteSection,
  deleteSectionItem,
  getSectionsByService,
  getServiceById,
  updateSection,
  updateSectionItem,
} from '../../api/serviceApi';

const EMPTY_SECTION = {
  sectionType: 'features',
  title: '',
  subtitle: '',
  orderIndex: 1,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  bannerImageUrl: '',
};

const EMPTY_ITEM = {
  icon: '',
  title: '',
  subtitle: '',
  description: '',
  orderIndex: 1,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
};

const SECTION_TYPES = ['all', 'hero', 'features', 'steps', 'why_choose_us', 'faq', 'cta'];

export default function ServiceSectionsPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const toastTimer = useRef(null);

  const [service, setService] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [sectionFormOpen, setSectionFormOpen] = useState(false);
  const [sectionEditing, setSectionEditing] = useState(null);
  const [sectionForm, setSectionForm] = useState(EMPTY_SECTION);
  const [sectionSaving, setSectionSaving] = useState(false);

  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [itemEditing, setItemEditing] = useState(null);
  const [itemSectionId, setItemSectionId] = useState('');
  const [itemForm, setItemForm] = useState(EMPTY_ITEM);
  const [itemSaving, setItemSaving] = useState(false);

  const [expanded, setExpanded] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const load = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const [serviceRes, sectionRes] = await Promise.all([
        getServiceById(serviceId),
        getSectionsByService(serviceId),
      ]);
      setService(serviceRes.data || null);
      const loaded = Array.isArray(sectionRes.data) ? sectionRes.data : [];
      setSections(loaded);

      setExpanded((prev) => {
        const next = { ...prev };
        loaded.forEach((section) => {
          if (next[section.id] === undefined) next[section.id] = true;
        });
        return next;
      });
    } catch (err) {
      setService(null);
      setSections([]);
      showToast(err.userMessage || 'Failed to load sections', 'error');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    load();
  }, [load]);

  const orderedSections = useMemo(() => [...sections].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)), [sections]);

  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orderedSections.filter((section) => {
      if (typeFilter !== 'all' && section.sectionType !== typeFilter) return false;
      if (!q) return true;
      return [section.title, section.subtitle, section.sectionType]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [orderedSections, query, typeFilter]);

  const stats = useMemo(() => {
    const totalItems = sections.reduce((sum, section) => sum + ((section.items || []).length), 0);
    const heroCount = sections.filter((section) => section.sectionType === 'hero').length;
    return { totalSections: sections.length, totalItems, heroCount };
  }, [sections]);

  const sectionToPayload = (section, overrideOrder) => ({
    sectionType: section.sectionType || 'features',
    title: section.title || '',
    subtitle: section.subtitle || '',
    orderIndex: Number(overrideOrder ?? section.orderIndex ?? 1),
    metaTitle: section.metaTitle || '',
    metaDescription: section.metaDescription || '',
    metaKeywords: section.metaKeywords || '',
    bannerImageUrl: section.bannerImage || section.bannerImageUrl || '',
  });

  const itemToPayload = (item, overrideOrder) => ({
    icon: item.icon || '',
    title: item.title || '',
    subtitle: item.subtitle || '',
    description: item.description || '',
    orderIndex: Number(overrideOrder ?? item.orderIndex ?? 1),
    metaTitle: item.metaTitle || '',
    metaDescription: item.metaDescription || '',
    metaKeywords: item.metaKeywords || '',
  });

  const openSectionCreate = () => {
    setSectionEditing(null);
    setSectionForm({ ...EMPTY_SECTION, orderIndex: Math.max(orderedSections.length + 1, 1) });
    setSectionFormOpen(true);
  };

  const openSectionEdit = (section) => {
    setSectionEditing(section);
    setSectionForm({
      ...EMPTY_SECTION,
      ...section,
      sectionType: section.sectionType || 'features',
      bannerImageUrl: section.bannerImage || section.bannerImageUrl || '',
      orderIndex: section.orderIndex ?? 1,
    });
    setSectionFormOpen(true);
  };

  const saveSection = async () => {
    setSectionSaving(true);
    try {
      const payload = {
        ...sectionForm,
        orderIndex: Math.max(1, Number(sectionForm.orderIndex || 1)),
      };
      if (sectionEditing?.id) {
        await updateSection(serviceId, sectionEditing.id, payload);
        showToast('Section updated');
      } else {
        await createSection(serviceId, payload);
        showToast('Section created');
      }
      setSectionFormOpen(false);
      load();
    } catch (err) {
      showToast(err.userMessage || 'Unable to save section', 'error');
    } finally {
      setSectionSaving(false);
    }
  };

  const removeSection = async (section) => {
    if (!window.confirm(`Delete section "${section.title || section.sectionType}"?`)) return;
    try {
      await deleteSection(serviceId, section.id);
      showToast('Section deleted');
      load();
    } catch (err) {
      showToast(err.userMessage || 'Unable to delete section', 'error');
    }
  };

  const openItemCreate = (sectionId) => {
    const parent = sections.find((section) => section.id === sectionId);
    const nextOrder = Math.max((parent?.items?.length || 0) + 1, 1);
    setItemSectionId(sectionId);
    setItemEditing(null);
    setItemForm({ ...EMPTY_ITEM, orderIndex: nextOrder });
    setItemFormOpen(true);
  };

  const openItemEdit = (sectionId, item) => {
    setItemSectionId(sectionId);
    setItemEditing(item);
    setItemForm({ ...EMPTY_ITEM, ...item, orderIndex: item.orderIndex ?? 1 });
    setItemFormOpen(true);
  };

  const saveItem = async () => {
    setItemSaving(true);
    try {
      const payload = {
        ...itemForm,
        orderIndex: Math.max(1, Number(itemForm.orderIndex || 1)),
      };
      if (itemEditing?.id) {
        await updateSectionItem(itemEditing.id, payload);
        showToast('Item updated');
      } else {
        await createSectionItem(itemSectionId, payload);
        showToast('Item created');
      }
      setItemFormOpen(false);
      load();
    } catch (err) {
      showToast(err.userMessage || 'Unable to save item', 'error');
    } finally {
      setItemSaving(false);
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm(`Delete item "${item.title || ''}"?`)) return;
    try {
      await deleteSectionItem(item.id);
      showToast('Item deleted');
      load();
    } catch (err) {
      showToast(err.userMessage || 'Unable to delete item', 'error');
    }
  };

  const moveSection = async (sectionId, direction) => {
    const current = [...orderedSections];
    const index = current.findIndex((section) => section.id === sectionId);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= current.length) return;

    const moved = current[index];
    const nextOrder = target + 1;

    setSavingOrder(true);
    try {
      await updateSection(serviceId, moved.id, sectionToPayload(moved, nextOrder));
      showToast('Section order updated');
      load();
    } catch (err) {
      showToast(err.userMessage || 'Unable to reorder sections', 'error');
    } finally {
      setSavingOrder(false);
    }
  };

  const moveItem = async (sectionId, itemId, direction) => {
    const section = orderedSections.find((entry) => entry.id === sectionId);
    if (!section) return;

    const items = [...(section.items || [])].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    const index = items.findIndex((item) => item.id === itemId);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= items.length) return;

    const moved = items[index];
    const nextOrder = target + 1;

    setSavingOrder(true);
    try {
      await updateSectionItem(moved.id, itemToPayload(moved, nextOrder));
      showToast('Item order updated');
      load();
    } catch (err) {
      showToast(err.userMessage || 'Unable to reorder items', 'error');
    } finally {
      setSavingOrder(false);
    }
  };

  const normalizeAllOrders = async () => {
    setSavingOrder(true);
    try {
      for (let i = 0; i < orderedSections.length; i += 1) {
        const section = orderedSections[i];
        await updateSection(serviceId, section.id, sectionToPayload(section, i + 1));

        const items = [...(section.items || [])].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        for (let j = 0; j < items.length; j += 1) {
          await updateSectionItem(items[j].id, itemToPayload(items[j], j + 1));
        }
      }
      showToast('Order normalized for sections and items');
      load();
    } catch (err) {
      showToast(err.userMessage || 'Unable to normalize order', 'error');
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="ap-sections-shell">
      {toast ? <div className={`ap-toast ${toast.type === 'error' ? 'ap-toast-error' : 'ap-toast-success'}`}>{toast.message}</div> : null}

      <div className="ap-page-header">
        <div className="ap-page-title">
          <button type="button" className="ap-btn ap-btn-ghost" onClick={() => navigate('/admin-portal/services')}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1>Service Sections</h1>
            <p className="ap-page-subtitle">{service ? `${service.title} / ${service.slug}` : 'Structure and sequence your section hierarchy'}</p>
          </div>
        </div>
        <div className="ap-actions">
          <button type="button" className="ap-btn ap-btn-secondary" onClick={load} disabled={loading || savingOrder}>Refresh</button>
          <button type="button" className="ap-btn ap-btn-secondary" onClick={normalizeAllOrders} disabled={loading || savingOrder || !sections.length}>
            <Sparkles size={14} /> Normalize Order
          </button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={openSectionCreate}><Plus size={14} /> Add Section</button>
        </div>
      </div>

      <div className="ap-grid ap-grid-3 ap-sections-stats">
        <div className="ap-card">
          <div className="ap-card-body ap-kpi">
            <div>
              <p className="ap-kpi-label">Total Sections</p>
              <p className="ap-kpi-value">{stats.totalSections}</p>
            </div>
            <div className="ap-kpi-icon blue"><Layers size={18} /></div>
          </div>
        </div>
        <div className="ap-card">
          <div className="ap-card-body ap-kpi">
            <div>
              <p className="ap-kpi-label">Total Items</p>
              <p className="ap-kpi-value">{stats.totalItems}</p>
            </div>
            <div className="ap-kpi-icon green"><Sparkles size={18} /></div>
          </div>
        </div>
        <div className="ap-card">
          <div className="ap-card-body ap-kpi">
            <div>
              <p className="ap-kpi-label">Hero Sections</p>
              <p className="ap-kpi-value">{stats.heroCount}</p>
            </div>
            <div className="ap-kpi-icon amber"><Sparkles size={18} /></div>
          </div>
        </div>
      </div>

      <div className="ap-card ap-sections-filters">
        <div className="ap-card-body">
          <div className="ap-row ap-sections-filter-row">
            <div className="ap-col ap-sections-search-col">
              <div className="ap-input-with-icon">
                <Search size={14} className="ap-input-icon" />
                <input className="ap-input ap-input-icon-pad" placeholder="Search sections by title/type" value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
            </div>
            <div className="ap-col ap-sections-filter-col">
              <div className="ap-input-with-icon">
                <Filter size={14} className="ap-input-icon" />
                <select className="ap-select ap-input-icon-pad" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                  {SECTION_TYPES.map((type) => (
                    <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="ap-loading"><div className="ap-spinner" /></div>
      ) : visibleSections.length ? (
        <div className="ap-grid">
          {visibleSections.map((section) => {
            const isOpen = expanded[section.id] !== false;
            const allSections = orderedSections;
            const sectionIndex = allSections.findIndex((entry) => entry.id === section.id);
            const sortedItems = [...(section.items || [])].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

            return (
              <div key={section.id} className="ap-accordion">
                <div className="ap-accordion-header">
                  <div>
                    <div className="ap-accordion-title">{section.title || section.sectionType}</div>
                    <div className="ap-accordion-subtitle ap-badge-row">
                      <span className="ap-badge ap-badge-blue">Type: {section.sectionType}</span>
                      <span className="ap-badge ap-badge-gray">Order: {section.orderIndex ?? '-'}</span>
                      <span className="ap-badge ap-badge-amber">Items: {sortedItems.length}</span>
                    </div>
                  </div>
                  <div className="ap-actions">
                    <button type="button" className="ap-btn ap-btn-secondary" disabled={savingOrder || sectionIndex <= 0} onClick={() => moveSection(section.id, -1)}>
                      <ArrowUp size={12} />
                    </button>
                    <button type="button" className="ap-btn ap-btn-secondary" disabled={savingOrder || sectionIndex >= allSections.length - 1} onClick={() => moveSection(section.id, 1)}>
                      <ArrowDown size={12} />
                    </button>
                    <button type="button" className="ap-btn ap-btn-secondary" onClick={() => openItemCreate(section.id)}><Plus size={12} /> Item</button>
                    <button type="button" className="ap-btn ap-btn-secondary" onClick={() => openSectionEdit(section)}><Pencil size={12} /> Edit</button>
                    <button type="button" className="ap-btn ap-btn-danger" onClick={() => removeSection(section)}><Trash2 size={12} /> Delete</button>
                    <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setExpanded((prev) => ({ ...prev, [section.id]: !isOpen }))}>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {isOpen ? (
                <div className="ap-accordion-body">
                  {sortedItems.length ? (
                    sortedItems.map((item, idx) => (
                      <div key={item.id} className="ap-item-row">
                          <div>
                            <div className="ap-item-title">{item.title || 'Untitled Item'}</div>
                            <div className="ap-item-subtitle">{item.subtitle || item.description || '-'}</div>
                            <div className="ap-field-hint">Order: {item.orderIndex ?? '-'} | Icon: {item.icon || '-'}</div>
                          </div>
                          <div className="ap-actions">
                            <button type="button" className="ap-btn ap-btn-secondary" disabled={savingOrder || idx <= 0} onClick={() => moveItem(section.id, item.id, -1)}>
                              <ArrowUp size={12} />
                            </button>
                            <button type="button" className="ap-btn ap-btn-secondary" disabled={savingOrder || idx >= sortedItems.length - 1} onClick={() => moveItem(section.id, item.id, 1)}>
                              <ArrowDown size={12} />
                            </button>
                            <button type="button" className="ap-btn ap-btn-secondary" onClick={() => openItemEdit(section.id, item)}>Edit</button>
                            <button type="button" className="ap-btn ap-btn-danger" onClick={() => removeItem(item)}>Delete</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="ap-empty">No items in this section. Add one to build this block.</div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ap-empty">No sections match current filters.</div>
      )}

      {sectionFormOpen ? (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true" aria-labelledby="section-form-title">
            <div className="ap-modal-header">
              <h2 id="section-form-title">{sectionEditing ? 'Edit Section' : 'Create Section'}</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setSectionFormOpen(false)}>Close</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                <div className="ap-field">
                  <label className="ap-label" htmlFor="section-type">Type</label>
                  <select id="section-type" className="ap-select" value={sectionForm.sectionType} onChange={(event) => setSectionForm((prev) => ({ ...prev, sectionType: event.target.value }))}>
                    {SECTION_TYPES.filter((type) => type !== 'all').map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="section-order">Order</label>
                  <input id="section-order" min={1} type="number" className="ap-input" value={sectionForm.orderIndex}
                    onChange={(event) => setSectionForm((prev) => ({ ...prev, orderIndex: event.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label" htmlFor="section-title">Title</label>
                  <input id="section-title" className="ap-input" value={sectionForm.title} onChange={(event) => setSectionForm((prev) => ({ ...prev, title: event.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label" htmlFor="section-subtitle">Subtitle</label>
                  <textarea id="section-subtitle" className="ap-textarea" value={sectionForm.subtitle}
                    onChange={(event) => setSectionForm((prev) => ({ ...prev, subtitle: event.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label" htmlFor="section-banner">Banner URL (Hero)</label>
                  <input id="section-banner" className="ap-input" value={sectionForm.bannerImageUrl || ''}
                    onChange={(event) => setSectionForm((prev) => ({ ...prev, bannerImageUrl: event.target.value }))} />
                  <div className="ap-field-hint">Recommended for production: `/assets/your-image.png`</div>
                </div>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="section-meta-title">Meta Title</label>
                  <input id="section-meta-title" className="ap-input" value={sectionForm.metaTitle || ''}
                    onChange={(event) => setSectionForm((prev) => ({ ...prev, metaTitle: event.target.value }))} />
                </div>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="section-meta-keywords">Meta Keywords</label>
                  <input id="section-meta-keywords" className="ap-input" value={sectionForm.metaKeywords || ''}
                    onChange={(event) => setSectionForm((prev) => ({ ...prev, metaKeywords: event.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label" htmlFor="section-meta-description">Meta Description</label>
                  <textarea id="section-meta-description" className="ap-textarea" value={sectionForm.metaDescription || ''}
                    onChange={(event) => setSectionForm((prev) => ({ ...prev, metaDescription: event.target.value }))} />
                </div>
              </div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setSectionFormOpen(false)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={saveSection} disabled={sectionSaving || !sectionForm.sectionType}>
                <Save size={14} /> {sectionSaving ? 'Saving...' : 'Save Section'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {itemFormOpen ? (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true" aria-labelledby="item-form-title">
            <div className="ap-modal-header">
              <h2 id="item-form-title">{itemEditing ? 'Edit Item' : 'Create Item'}</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setItemFormOpen(false)}>Close</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                <div className="ap-field">
                  <label className="ap-label" htmlFor="item-title">Title</label>
                  <input id="item-title" className="ap-input" value={itemForm.title} onChange={(event) => setItemForm((prev) => ({ ...prev, title: event.target.value }))} />
                </div>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="item-order">Order</label>
                  <input id="item-order" min={1} type="number" className="ap-input" value={itemForm.orderIndex} onChange={(event) => setItemForm((prev) => ({ ...prev, orderIndex: event.target.value }))} />
                </div>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="item-icon">Icon</label>
                  <input id="item-icon" className="ap-input" value={itemForm.icon} onChange={(event) => setItemForm((prev) => ({ ...prev, icon: event.target.value }))} />
                </div>
                <div className="ap-field">
                  <label className="ap-label" htmlFor="item-subtitle">Subtitle</label>
                  <input id="item-subtitle" className="ap-input" value={itemForm.subtitle} onChange={(event) => setItemForm((prev) => ({ ...prev, subtitle: event.target.value }))} />
                </div>
                <div className="ap-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="ap-label" htmlFor="item-description">Description</label>
                  <textarea id="item-description" className="ap-textarea" value={itemForm.description}
                    onChange={(event) => setItemForm((prev) => ({ ...prev, description: event.target.value }))} />
                </div>
              </div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setItemFormOpen(false)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={saveItem} disabled={itemSaving || !itemForm.title}>
                <Save size={14} /> {itemSaving ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
