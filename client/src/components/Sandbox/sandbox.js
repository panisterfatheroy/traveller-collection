import React, { Component } from 'react';
import { connect } from 'react-redux';


import { getItemById} from '../../actions';




class Sandbox extends Component {


    state = {
        fileName: 'myFile'
    }

    // componentDidMount() {
    //     this.props.dispatch(getItemById(this.props.match.params.id))
    // }


    render() {


        return (
            <div>
                <p>{this.state.fileName}</p>

                <form action={`http://127.0.0.1:3001/fresh-multer-test/${this.state.fileName}`} method="post" encType="multipart/form-data">
                    <input type="file" name="avatar1" />

                    <input type="file" name="avatar2" />

                    <br/><br/>

                    <input type="submit" value="Submit" />
                </form>

              

            </div>
            
        )
    }
}

function mapStateToProps(state) {
    return {
        items:state.items,

    }
}

export default connect(mapStateToProps)(Sandbox)


