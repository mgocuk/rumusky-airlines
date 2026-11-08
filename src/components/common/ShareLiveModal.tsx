import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { realtimeSync, NetworkInfo } from '../../services/realtimeSync';
import {
  X,
  Share2,
  Copy,
  Check,
  Smartphone,
  Laptop,
  Users,
  Wifi,
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface ShareLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLiveModal: React.FC<ShareLiveModalProps> = ({ isOpen, onClose }) => {
  const { connectedClientsCount, isRealtimeConnected } = useApp();
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch network IP & info
    realtimeSync.fetchNetworkInfo().then(async (info) => {
      if (info) {
        setNetworkInfo(info);
        try {
          const qr = await QRCode.toDataURL(info.url, {
            width: 260,
            margin: 2,
            color: {
              dark: '#0B2545',
              light: '#FFFFFF'
            }
          });
          setQrDataUrl(qr);
        } catch (err) {
          console.error('Error generating QR code:', err);
        }
      }
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = networkInfo?.url || `http://${window.location.hostname}:${window.location.port || '3000'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-brand-border animate-scale-up">
        
        {/* Header */}
        <div className="bg-brand-navy text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-blue/30 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg flex items-center gap-2">
                <span>Çok Kullanıcılı Canlı Paylaşım</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </h3>
              <p className="text-xs text-slate-300">
                Telefon veya diğer cihazlardan öğrenci testi için canlı ağ bağlantısı
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Live Status Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${isRealtimeConnected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
              <div className="text-xs">
                <span className="font-bold text-brand-navy">Canlı Senkronizasyon: </span>
                <span className="text-emerald-700 font-semibold">
                  {isRealtimeConnected ? 'Aktif & Senkronize' : 'Yerel Mod'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue font-bold text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>{connectedClientsCount} Cihaz Bağlı</span>
            </div>
          </div>

          {/* QR Code and Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Canlı Test QR Kodu"
                  className="w-48 h-48 rounded-xl shadow-xs border border-white"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-500">
                  QR Kod Üretiliyor...
                </div>
              )}
              <span className="text-[11px] font-bold text-brand-muted mt-2 text-center flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-brand-blue" />
                Telefon Kamerasıyla Taratın
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 text-brand-blue" />
                  <span>Wi-Fi / Yerel Ağ Bağlantısı</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Aynı Wi-Fi ağına bağlı herhangi bir telefondan, tabletten veya bilgisayardan bu linki açabilirsiniz.
                </p>
              </div>

              {/* Direct URL input with Copy button */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  Bağlantı Linki:
                </label>
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl p-1.5 shadow-2xs">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="w-full text-xs font-mono font-bold text-brand-navy px-2 bg-transparent focus:outline-hidden"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-brand-blue hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Öğrenciler giriş yaptığında <strong>sadece Müşteri Paneli</strong>'ni görürler. Bilet aldıklarında aldıkları koltuk ve biletler anında Super Admin ekranınıza düşer!
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Feature highlights */}
          <div className="border-t border-slate-100 pt-4 space-y-2.5">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Nasıl Çalışır? (Eşzamanlı Senkronizasyon):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  1
                </div>
                <div className="text-slate-600">
                  <strong className="text-brand-navy block">Öğrenci Bilet Alınca:</strong>
                  Koltuk haritasında seçilen koltuk anında kilitlenir; admin panelinde yeni rezervasyon anında görünür.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-blue-100 text-brand-blue flex items-center justify-center shrink-0 font-bold text-[10px]">
                  2
                </div>
                <div className="text-slate-600">
                  <strong className="text-brand-navy block">Süper Admin Değişiklik Yapınca:</strong>
                  Logo, firma adı, üst menü butonları veya uçuş seferleri değiştiğinde tüm telefonların ekranı anında yenilenir.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Server-Sent Events & Broadcast Senkronizasyonu Aktif</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
