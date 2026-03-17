import { useMemo, useState } from 'react';
import { Eye, Layers, Pencil, Trash2, Clock3 } from 'lucide-react';
import { resolveMediaUrl } from '../../../utils/media';

export default function ServiceCard({ service, onView, onManageSections, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  const updatedText = useMemo(() => {
    if (!service?.updatedAt) return '';
    const parsed = new Date(service.updatedAt);
    if (Number.isNaN(parsed.getTime())) return '';
    return `Updated ${parsed.toLocaleDateString()}`;
  }, [service?.updatedAt]);

  return (
    <div className="ap-service-card">
      <div className="ap-service-banner">
        {service.bannerImage && !imageError ? (
          <img src={resolveMediaUrl(service.bannerImage)} alt={service.title || 'Service'} onError={() => setImageError(true)} />
        ) : (
          <div className="ap-service-banner-placeholder"><Layers size={24} /></div>
        )}
      </div>

      <div className="ap-service-body">
        <div className="ap-service-top">
          <div className="ap-service-title">{service.title || 'Untitled'}</div>
          <span className={`ap-badge ${service.isActive !== false ? 'ap-badge-green' : 'ap-badge-gray'}`}>
            {service.isActive !== false ? 'Active' : 'Inactive'}
          </span>
          <span className="ap-badge" style={{
            background: service.theme === 'gold' ? 'rgba(212,175,55,0.12)' : 'rgba(37,99,235,0.1)',
            color: service.theme === 'gold' ? '#B8962E' : '#2563EB',
            textTransform: 'capitalize',
          }}>
            {service.theme || 'blue'}
          </span>
        </div>
        {service.subtitle ? <div className="ap-service-subtitle">{service.subtitle}</div> : null}
        <div className="ap-service-slug">
          <span className="ap-service-slug-prefix">/services/</span>
          <span className="ap-service-slug-value">{service.slug}</span>
        </div>
        {updatedText ? (
          <div className="ap-service-meta">
            <Clock3 size={11} />
            <span>{updatedText}</span>
          </div>
        ) : null}
      </div>

      <div className="ap-service-actions">
        <button type="button" className="ap-service-action view" onClick={() => onView(service)}><Eye size={12} /> View</button>
        <button type="button" className="ap-service-action sections" onClick={() => onManageSections(service)}><Layers size={12} /> Sections</button>
        <button type="button" className="ap-service-action edit" onClick={() => onEdit(service)}><Pencil size={12} /> Edit</button>
        <button type="button" className="ap-service-action delete" onClick={() => onDelete(service)}><Trash2 size={12} /> Delete</button>
      </div>
    </div>
  );
}
