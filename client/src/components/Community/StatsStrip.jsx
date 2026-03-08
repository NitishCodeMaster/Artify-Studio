import React from 'react';

export function StatsStrip() {
    return (
        <div className="mt-20 border-t border-white/10 pt-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                    { label: "Active Artists", value: "10k+" },
                    { label: "Daily Discussions", value: "500+" },
                    { label: "Collabs Formed", value: "1.2k" },
                    { label: "Countries", value: "15+" },
                ].map((stat, index) => (
                    <div key={index}>
                        <h4 className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</h4>
                        <p className="text-sm text-white/40 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}