export default function EmailCard({
  data: { title, description, image },
  setShowEmailForm,
}) {
  const styles = {
    //    width:'40%' if width of each card is to be manualy adjust use this
  };
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
