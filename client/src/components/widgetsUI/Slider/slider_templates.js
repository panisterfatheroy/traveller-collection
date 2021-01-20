import React from 'react';
import Slick from 'react-slick';   // uses cdn css
import { Link } from 'react-router-dom';

import style from './slider.module.css';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX_CLIENT;

const SliderTemplates = (props) => {

    console.log(props.data.list);

    let template = null;


    const settings = {
        dots: false,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        ...props.settings
    }



    switch(props.type) {
        case 'featured' :

            template = props.data.list.map( (item, i) => {
                return(
                    <div key={i}>
                        <div className={style.featured_item}>
                            <div className={style.featured_image}
                                style={{
                                    background: `url(${FS_PREFIX}/assets/media/items/${item._id}/thumbnail/0.jpg)`
                                }}
                            >
                            </div>

                            <Link to={`./items/${item._id}`}>
                                <div className={style.featured_caption}>
                                    {item.title}
                                </div>
                            </Link>
                        </div>
                    </div>
                )
            })


        break;
        
        default: 
            template = null;
    }


    return(
        <Slick {...settings}>
            {template}
        </Slick>
    )
}

export default SliderTemplates;