import React from 'react';
import { Building2, Thermometer, Layers, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { WarehouseBinLocation } from '../../types/inventory';

interface MultiWarehouseTabProps {
  bins: WarehouseBinLocation[];
}

export const MultiWarehouseTab: React.FC<MultiWarehouseTabProps> = ({ bins }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-cyan-400" />
            Visual Lay-Out Gudang Multi-Zone & Ruang Dingin (Cold Room 15°C)
          </h2>
          <p className="text-xs text-slate-400">
            Pemantauan Kapasitas Rak/Bin, Sensor Suhu Digital Realtime, & Pemetaan Lokasi Penyimpanan CPKB Standard
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-3 py-1.5 rounded-xl border border-cyan-500/40 font-bold">
          IoT Temperature Sensors Online (6 Nodes)
        </span>
      </div>

      {/* Grid of Warehouse Bins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bins.map((bin) => {
          const occupancyPct = Math.round((bin.occupiedKg / bin.capacityKg) * 100);
          const isHighOccupancy = occupancyPct >= 80;

          return (
            <div
              key={bin.id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block">{bin.warehouseType}</span>
                  <h3 className="font-bold text-white text-xs font-mono">{bin.binCode}</h3>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    bin.status === 'Normal'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {bin.status}
                </span>
              </div>

              {/* Zone Name */}
              <p className="text-xs text-slate-300 font-medium line-clamp-1">{bin.zoneName}</p>

              {/* Sensor Temperature */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-cyan-400" />
                  <span className="text-slate-400 text-[11px]">Sensor Suhu:</span>
                </div>
                <span className="font-bold text-cyan-300">{bin.currentTempSensor}</span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Penggunaan Kapasitas:</span>
                  <span className={`font-bold ${isHighOccupancy ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {bin.occupiedKg.toLocaleString()} / {bin.capacityKg.toLocaleString()} Kg ({occupancyPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isHighOccupancy ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{bin.itemCount} SKU Terimpan</span>
                <span className="text-slate-500">Target Temp: {bin.temperatureTarget}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
