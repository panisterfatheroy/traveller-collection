import React from 'react';
import { Link } from 'react-router-dom';


const CatItem = (props) => {
    

    const addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
        
    } 

    console.log(props)
    

    
    return (
        <div className="cat_item_card">
            <div className="cat_item_img">
                {/* <Link to={`/items/${props.cat._id}`} target="_blank"> */}
                    <img src={`/media/cover_img_cat/${props.cat._id}.jpg`} alt="category cover" onError={addDefaultImg} />
                {/* </Link> */}
            </div>

            <div className="cat_item_text">
                <h2><b>{props.cat.title}</b></h2><br />
                {props.cat.description ? props.cat.description : null }<br />


            </div>

            {/* <div className="cat_item_accept">
                <button 
                    type="button" 
                    onClick={() => { if (window.confirm('This will add the item to the collection.')) props.handleChoicePass(props.item._id, 'accept') } }
                >
                    Accept
                </button>
                
                <button 
                    type="button" 
                    onClick={() =>  { if (window.confirm('Are you sure you wish to permanently delete this item and all associated media?')) props.handleChoicePass(props.item._id, 'reject') } }
                >
                    Reject
                </button>
            </div> */}





        </div>
    );
};

export default CatItem;