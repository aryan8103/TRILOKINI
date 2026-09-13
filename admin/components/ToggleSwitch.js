export default function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
      style={{ backgroundColor: checked ? 'var(--primary)' : '#2a3350' }}
    >
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
        style={{ marginTop: '2px' }}
      />
    </button>
  );
}
