
export default function Card({data:{title, info,image}, handleCardClick}){



const styles={
//    width:'40%' if width of each card is to be manualy adjust use this
}
    return (
        <div className="card" onClick={() => handleCardClick(title)} style={styles}>
        <img src={image} alt="Academic Requests" />
       <div className="card-footer">
           <h4>
            {title}
            </h4>
           <p>
            {info}
           </p>
       </div>
   </div> 
    )
}