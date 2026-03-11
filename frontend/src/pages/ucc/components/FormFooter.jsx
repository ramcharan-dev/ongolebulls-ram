export default function FormFooter({
  onPrev,
  onDraft,
  onNext,
  prevDisabled,
  draftDisabled,
  nextDisabled,
  nextLabel = 'Next',
  savingDraft,
}) {
  return (
    <footer className="ucc-form-footer">
      <button type="button" onClick={onPrev} disabled={prevDisabled} className="ucc-btn ucc-btn-secondary">
        Previous
      </button>

      <div className="ucc-form-footer-right">
        <button type="button" onClick={onDraft} disabled={draftDisabled} className="ucc-btn ucc-btn-ghost">
          {savingDraft ? 'Saving...' : 'Save Draft'}
        </button>
        <button type="button" onClick={onNext} disabled={nextDisabled} className="ucc-btn ucc-btn-primary">
          {nextLabel}
        </button>
      </div>
    </footer>
  );
}
