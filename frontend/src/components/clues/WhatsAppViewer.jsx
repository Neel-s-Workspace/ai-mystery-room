import React from 'react';
import { MessageSquare, CheckCheck, Trash2, Shield, Phone, Video, MoreVertical, Smartphone } from 'lucide-react';

export const WhatsAppViewer = ({ clue, victimName }) => {
  const messages = clue?.payload?.messages || [];

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Evidence Tag */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Smartphone className="w-4 h-4" />
          <span className="font-bold uppercase">{clue.title || 'Recovered Encrypted Chat Log'}</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
          Extracted via Forensic Bypass
        </span>
      </div>

      {/* Simulated Smartphone Shell */}
      <div className="rounded-3xl border-4 border-slate-700 bg-slate-950 shadow-2xl overflow-hidden max-w-lg mx-auto">
        {/* Smartphone Notch / Top Bar */}
        <div className="bg-slate-900 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800">
          <span>09:41</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>5G Forensic Tap</span>
          </div>
        </div>

        {/* WhatsApp App Header */}
        <div className="bg-[#121B22] px-4 py-3 border-b border-[#222E35] flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold text-xs uppercase shadow-md">
              {victimName ? victimName.slice(0, 2) : 'VIC'}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100 flex items-center space-x-1.5">
                <span>{victimName || 'Victim’s Terminal'}</span>
              </h4>
              <p className="text-[10px] text-emerald-400 font-mono">Forensic Message Archive</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <Phone className="w-4 h-4 hover:text-white cursor-pointer" />
            <Video className="w-4 h-4 hover:text-white cursor-pointer" />
            <MoreVertical className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* WhatsApp Chat Background & Messages */}
        <div 
          className="p-4 space-y-3 min-h-[420px] max-h-[500px] overflow-y-auto"
          style={{
            backgroundColor: '#0B141A',
            backgroundImage: `radial-gradient(#182229 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        >
          {/* Encryption Notice */}
          <div className="text-center my-2">
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono px-3 py-1 rounded bg-[#182229] border border-[#222E35] text-amber-300">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Messages extracted post-mortem by cyber forensics team</span>
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs font-mono">
              No chat logs decrypted from this device image.
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isVictim = msg.sender?.toLowerCase().includes('victim') || 
                               (victimName && msg.sender?.toLowerCase().includes(victimName.toLowerCase().split(' ')[0]));

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isVictim ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-md relative ${
                      isVictim
                        ? 'bg-[#005C4B] text-slate-100 rounded-tr-none'
                        : 'bg-[#202C33] text-slate-200 rounded-tl-none border border-[#2B3942]'
                    }`}
                  >
                    {/* Sender Tag */}
                    {!isVictim && (
                      <p className="text-[10px] font-bold text-emerald-400 font-mono mb-1">
                        {msg.sender}
                      </p>
                    )}

                    {/* Message Body */}
                    {msg.isDeleted ? (
                      <div className="flex items-center space-x-1.5 text-slate-400 italic text-[11px]">
                        <Trash2 className="w-3 h-3 text-rose-400 flex-shrink-0" />
                        <span>🚫 This message was deleted by sender</span>
                      </div>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Timestamp & Status */}
                    <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-slate-400 font-mono">
                      <span>{msg.timestamp || '11:00 PM'}</span>
                      {isVictim && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Disabled Input Footer */}
        <div className="bg-[#121B22] p-3 border-t border-[#222E35] flex items-center justify-center text-xs font-mono text-slate-500">
          🔒 Thread locked by Forensic Evidence Unit
        </div>
      </div>

      <p className="text-center text-[11px] font-mono text-slate-500">
        Carefully note message timestamps against claimed alibis and CCTV surveillance records.
      </p>
    </div>
  );
};
