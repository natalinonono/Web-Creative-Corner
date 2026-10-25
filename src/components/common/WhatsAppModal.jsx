import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { MessageSquare, ExternalLink, Copy, Check, Edit3, RotateCcw } from 'lucide-react';

export const WhatsAppModal = ({ 
  isOpen, 
  onClose, 
  recipientName = 'Penerima', 
  phoneNumber: initialPhone = '6281234567890', 
  messageText: initialMessage = '', 
  title = "Pratinjau Pengingat WhatsApp" 
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [messageText, setMessageText] = useState(initialMessage);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPhoneNumber(initialPhone || '6281234567890');
    setMessageText(initialMessage || '');
    setIsManualEdit(false);
  }, [initialPhone, initialMessage, isOpen]);

  if (!isOpen) return null;

  const cleanPhone = (phoneNumber || '').replace(/[^0-9]/g, '');
  const encodedUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(encodedUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleResetToDefault = () => {
    setMessageText(initialMessage);
    setPhoneNumber(initialPhone);
    setIsManualEdit(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
          </button>
          <button 
            type="button" 
            className="btn btn-whatsapp"
            onClick={handleOpenWhatsApp}
          >
            <ExternalLink size={16} />
            <span>Buka WhatsApp Sekarang</span>
          </button>
        </>
      }
    >
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <MessageSquare size={18} color="#10B981" />
            <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>Kirim Pesan Resmi Creative Corner</strong>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0 }}>
            Tujuan: <strong>{recipientName}</strong> (<code>+{cleanPhone}</code>)
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setIsManualEdit(!isManualEdit)}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
        >
          <Edit3 size={13} />
          <span>{isManualEdit ? 'Pratinjau Balon Chat' : 'Tulis / Edit Manual'}</span>
        </button>
      </div>

      {isManualEdit ? (
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Nomor WhatsApp Tujuan (Ketik Manual)</label>
            <input
              type="text"
              className="form-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="6281234567890"
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Teks Pesan WhatsApp (Ketik / Ubah Manual)</label>
            <textarea
              className="form-textarea"
              rows="6"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Tuliskan pesan WhatsApp manual Anda..."
              style={{ fontSize: '0.85rem' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetToDefault}
              style={{ fontSize: '0.725rem' }}
            >
              <RotateCcw size={12} />
              <span>Kembalikan Templat Semula</span>
            </button>
          </div>
        </div>
      ) : (
        /* WhatsApp Message Preview Bubble */
        <div style={{
          background: '#EFEAE2',
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #CBD5E1'
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: '1rem 1.25rem',
            borderRadius: '10px 10px 10px 2px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            fontSize: '0.875rem',
            color: '#111827',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            position: 'relative'
          }}>
            {messageText}
            <div style={{
              fontSize: '0.7rem',
              color: '#64748B',
              textAlign: 'right',
              marginTop: '0.5rem'
            }}>
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
