export default function EmailCard({
  data: { title, description, image },
  setShowEmailForm,
}) {
  return (
    <div className="card" onClick={() => setShowEmailForm(true)}>
      <img src={image} alt="Card" />
      <div className="card-footer">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}
