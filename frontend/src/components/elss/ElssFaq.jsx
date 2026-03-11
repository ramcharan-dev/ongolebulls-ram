import { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: 'What is ELSS?',
    answer: 'ELSS is an equity mutual fund category that qualifies for Section 80C tax deduction and has a 3-year lock-in period.',
  },
  {
    question: 'How much tax can I save with ELSS?',
    answer: 'You can claim deduction up to Rs 1.5 lakh under Section 80C. Depending on your tax slab, the tax saving can go up to around Rs 46,800.',
  },
  {
    question: 'What is the lock-in period?',
    answer: 'ELSS has a mandatory 3-year lock-in for each individual investment installment.',
  },
  {
    question: 'Is ELSS better than PPF?',
    answer: 'ELSS has a shorter lock-in and market-linked return potential, while PPF offers government-backed fixed returns and longer lock-in.',
  },
  {
    question: 'Can I invest via SIP?',
    answer: 'Yes. You can invest in ELSS through SIP or lumpsum. Each SIP installment will complete its own 3-year lock-in.',
  },
];

export default function ElssFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section aria-labelledby="elss-faq-title">
      <div className="elss-section-head">
        <p className="elss-kicker">FAQs</p>
        <h2 id="elss-faq-title">Frequently Asked Questions</h2>
      </div>

      <div className="elss-faq-list">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `elss-faq-panel-${index}`;

          return (
            <article key={item.question} className={`elss-faq-item ${isOpen ? 'is-open' : ''}`}>
              <h3>
                <button
                  type="button"
                  className="elss-faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                >
                  <span>{item.question}</span>
                  <span className="elss-faq-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
              </h3>
              <div id={panelId} className="elss-faq-panel" hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
