import { useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function useAnimatedNumber(target, duration = 650) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    let frame;
    const from = value;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(from + (target - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

function ResultTile({ label, value, tone }) {
  const animated = useAnimatedNumber(value);

  return (
    <div className={`elss-result-tile ${tone || ''}`.trim()}>
      <span>{label}</span>
      <strong>{formatCurrency(animated)}</strong>
    </div>
  );
}

export default function ElssSipCalculator() {
  const [monthlySip, setMonthlySip] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);

  const { invested, returns, wealth } = useMemo(() => {
    const months = years * 12;
    const investedAmount = monthlySip * months;

    const monthlyRate = returnRate / 100 / 12;
    const wealthAmount = monthlyRate === 0
      ? investedAmount
      : monthlySip * ((((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate));

    const estimatedReturns = Math.max(wealthAmount - investedAmount, 0);

    return {
      invested: investedAmount,
      returns: estimatedReturns,
      wealth: wealthAmount,
    };
  }, [monthlySip, returnRate, years]);

  const chartData = useMemo(() => ({
    labels: ['Total Invested', 'Estimated Returns'],
    datasets: [
      {
        data: [invested, returns],
        backgroundColor: ['#2563eb', '#0ea5e9'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  }), [invested, returns]);

  return (
    <section aria-labelledby="elss-sip-title">
      <div className="elss-section-head">
        <p className="elss-kicker">Planning Tool</p>
        <h2 id="elss-sip-title">ELSS SIP Calculator</h2>
      </div>

      <div className="elss-calc-grid">
        <div className="elss-calc-inputs">
          <label>
            Monthly SIP Amount
            <div className="elss-input-row">
              <span>Rs</span>
              <input
                type="number"
                min={500}
                step={500}
                value={monthlySip}
                onChange={(event) => setMonthlySip(Number(event.target.value) || 0)}
              />
            </div>
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={Math.min(monthlySip, 100000)}
              onChange={(event) => setMonthlySip(Number(event.target.value))}
            />
          </label>

          <label>
            Expected Return %
            <div className="elss-input-row">
              <input
                type="number"
                min={1}
                max={25}
                step={0.1}
                value={returnRate}
                onChange={(event) => setReturnRate(Number(event.target.value) || 0)}
              />
              <span>%</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={0.1}
              value={Math.min(Math.max(returnRate, 1), 25)}
              onChange={(event) => setReturnRate(Number(event.target.value))}
            />
          </label>

          <label>
            Time Period (Years)
            <div className="elss-input-row">
              <input
                type="number"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(event) => setYears(Number(event.target.value) || 1)}
              />
              <span>Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={Math.min(Math.max(years, 1), 40)}
              onChange={(event) => setYears(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="elss-calc-results">
          <div className="elss-chart-wrap">
            <Doughnut
              data={chartData}
              options={{
                cutout: '72%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      boxWidth: 8,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`,
                    },
                  },
                },
                animation: {
                  animateRotate: true,
                  duration: 900,
                },
              }}
            />
          </div>

          <div className="elss-results-grid" aria-live="polite">
            <ResultTile label="Total Invested" value={invested} />
            <ResultTile label="Estimated Returns" value={returns} tone="is-accent" />
            <ResultTile label="Total Wealth" value={wealth} tone="is-strong" />
          </div>
        </div>
      </div>
    </section>
  );
}
