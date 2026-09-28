import { useState } from 'react';
import { t, PORTALS, STAMP_DUTY_RATES, REGISTRATION_FEE_RATE, CHECKLISTS, type Lang } from '../config';
import { ExternalLink, Calculator, ClipboardList } from 'lucide-react';

interface FreeToolsProps {
  lang: Lang;
}

export default function FreeTools({ lang }: FreeToolsProps) {
  const tr = t[lang];

  return (
    <section id="free-tools" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate mb-12">
          {tr.freeTools.title}
        </h2>

        {/* Government Portals */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-slate mb-4 flex items-center gap-2">
            <ExternalLink size={18} className="text-primary" />
            {tr.freeTools.portals}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTALS.map((portal, i) => (
              <a
                key={i}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-bg hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
                  <ExternalLink size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate text-sm">{portal.name[lang]}</h4>
                  <p className="text-xs text-slate-light mt-0.5">{portal.desc[lang]}</p>
                  <p className="text-xs text-amber-600 mt-1">{tr.common.officialSite}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stamp Duty Calculator */}
          <StampDutyCalculator lang={lang} />
          
          {/* Document Checklist */}
          <DocumentChecklist lang={lang} />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// STAMP DUTY CALCULATOR
// ============================================================
function StampDutyCalculator({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const [value, setValue] = useState('');
  const [buyerType, setBuyerType] = useState<'male' | 'female' | 'joint'>('male');
  const [areaType, setAreaType] = useState<'urban' | 'rural'>('urban');
  const [result, setResult] = useState<{ stampDuty: number; regFee: number; total: number } | null>(null);

  const calculate = () => {
    const propValue = parseFloat(value);
    if (!propValue || propValue <= 0) return;
    
    const rate = STAMP_DUTY_RATES[buyerType][areaType];
    const stampDuty = Math.round(propValue * rate / 100);
    const regFee = Math.round(propValue * REGISTRATION_FEE_RATE / 100);
    setResult({ stampDuty, regFee, total: stampDuty + regFee });
  };

  return (
    <div className="bg-bg rounded-2xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-slate mb-4 flex items-center gap-2">
        <Calculator size={18} className="text-primary" />
        {tr.freeTools.calculator.title}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate mb-1">
            {tr.freeTools.calculator.propertyValue}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="₹ 10,00,000"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate mb-1">
              {tr.freeTools.calculator.buyerType}
            </label>
            <select
              value={buyerType}
              onChange={(e) => setBuyerType(e.target.value as 'male' | 'female' | 'joint')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="male">{tr.freeTools.calculator.male}</option>
              <option value="female">{tr.freeTools.calculator.female}</option>
              <option value="joint">{tr.freeTools.calculator.joint}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1">
              {tr.freeTools.calculator.areaType}
            </label>
            <select
              value={areaType}
              onChange={(e) => setAreaType(e.target.value as 'urban' | 'rural')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="urban">{tr.freeTools.calculator.urban}</option>
              <option value="rural">{tr.freeTools.calculator.rural}</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
        >
          {tr.freeTools.calculator.calculate}
        </button>

        {result && (
          <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-light">{tr.freeTools.calculator.result}:</span>
              <span className="font-bold text-slate">₹{result.stampDuty.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-light">{tr.freeTools.calculator.regFee}:</span>
              <span className="font-bold text-slate">₹{result.regFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
              <span className="font-bold text-slate">{tr.freeTools.calculator.total}:</span>
              <span className="font-bold text-primary text-lg">₹{result.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-amber-600">⚠️ {tr.freeTools.calculator.note}</p>
      </div>
    </div>
  );
}

// ============================================================
// DOCUMENT CHECKLIST
// ============================================================
function DocumentChecklist({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const [type, setType] = useState<'buy' | 'sell' | 'inherit'>('buy');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-bg rounded-2xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-slate mb-4 flex items-center gap-2">
        <ClipboardList size={18} className="text-primary" />
        {tr.freeTools.checklistTool.title}
      </h3>

      {/* Type selector */}
      <div className="flex gap-2 mb-4">
        {(['buy', 'sell', 'inherit'] as const).map((t_type) => (
          <button
            key={t_type}
            onClick={() => setType(t_type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              type === t_type
                ? 'bg-primary text-white'
                : 'bg-white text-slate border border-gray-200 hover:border-primary/30'
            }`}
          >
            {t_type === 'buy' ? tr.freeTools.checklistTool.buy : t_type === 'sell' ? tr.freeTools.checklistTool.sell : tr.freeTools.checklistTool.inherit}
          </button>
        ))}
      </div>

      {/* Checklist */}
      <ul className="space-y-2 mb-4">
        {CHECKLISTS[type][lang].map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              id={`check-${i}`}
            />
            <label htmlFor={`check-${i}`} className="text-slate-light cursor-pointer">
              {item}
            </label>
          </li>
        ))}
      </ul>

      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate hover:border-primary/30 transition-colors no-print"
      >
        🖨️ {tr.freeTools.checklistTool.print}
      </button>
    </div>
  );
}
