import "./styles/MatchSuggestions.css";

export default function MatchSuggestions({ matches, onSelect }) {
  if (!matches.length) return null;
  return (
    <div className="match-suggestions">
      <h4>Possible matches</h4>
      {matches.map((m) => (
        <div key={m.id} className="match-row" onClick={() => onSelect(m)}>
          <span>{m.name}</span>
          <span>{Math.round(m.score)}% match</span>
        </div>
      ))}
    </div>
  );
}
