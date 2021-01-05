import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { getAllCats, getAllSubCats  } from '../../../actions';
import { addCat, deleteCat, addSubcat, deleteSubcat, updateCat, updateSubcat  }  from '../../../actions';


const config = require('../../../config_client').get(process.env.NODE_ENV);


class AdminCat extends Component {


    state = {
        formdata: {
            cat: {
                _id: null,
                title: null,
                description: null,
                catIsHidden: false
            }
            
        },
        imgSrc: `/media/cover_img_cat/${this.props.chosenCatInfo._id}.jpg`,
        saved: false,
        catDeleted: false,

    }

    componentDidMount() {
        this.props.dispatch(getAllCats());
    }

    componentDidUpdate(prevProps) {
    
        if (this.props != prevProps) {

            if(this.props.chosenCatInfo ) {
                let tempFormdata = {
                    cat: {
                        ...this.state.formdata.cat,
                        _id: this.props.chosenCatInfo._id,
                        title: this.props.chosenCatInfo.title,
                        description: this.props.chosenCatInfo.description,
                        catIsHidden: this.props.chosenCatInfo.catIsHidden || false
        
                    }
                }

                this.setState({
                    formdata: tempFormdata
                })

            }


            // if (this.props.subcats && this.props.subcats.length) {
            //     if (this.props.subcats != prevProps.subcats) {

            //         let tempAllSubcats = [];
            //         let tempTheseSubcats = [];

            //         if (this.props.subcats) {

            //             tempAllSubcats = this.props.subcats;

            //             this.props.subcats.map( (subcat, i) => {
            //                 if (subcat.parent_cat == this.props.chosenCatInfo._id) {
            //                     tempTheseSubcats.push(subcat)
            //                 }
            //             })
            //         }
                    
            //         this.setState({
            //             formdata: {
            //                 ...this.state.formdata,
            //                 allSubcats: tempAllSubcats,
            //                 // theseSubcats: tempTheseSubcats
            //             }
            //         })
            //     }
            // }

            
        //     if (this.props.subcats && this.state.formdata.cat._id) {
        //         let tempImgSrcSubs = [];
        //         this.props.subcats.forEach( subcat => {
                    
        //             if (subcat.parent_cat === this.state.formdata.cat._id ) {
        //                 tempImgSrcSubs.push(`/media/cover_img_subcat/${subcat._id}.jpg`)

        //             }
        //         } )
        //         this.setState({
        //             imgSrcSubs: tempImgSrcSubs
        //         })
        //     }
        // }
        // { this.state.formdata.allSubcats.length ?
        //     this.state.formdata.allSubcats.map( (subcat, i) => (
        //         (subcat.parent_cat == this.props.chosenCatInfo._id) && !subcat.isDeleted ? 
        }
    }

    // not used
    handleTabIndex = () => {
        // console.log(this.props.index);
        this.props.getTabIndex(this.props.index)
    }


    deleteImage = () => {

        let data = {
            path: `/cover_img_cat/${this.state.formdata.cat._id}.jpg`
        };
        
        axios.post(`http://${config.IP_ADDRESS}:3001/delete-file`, data  )

        this.setState({
            imgSrc: '/media/default/default.jpg'
        })
    }

    // *************** UPLOAD LOGIC ********************

    onImgChange = (event) => {


        var files = event.target.files;

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFile: files
            })
        }

        this.setState({
            imgSrc: URL.createObjectURL(event.target.files[0])
        })

    }


    // onSubImgChange = (event, id, i) => {

    //     console.log(id)
    //     var files = event.target.files;

    //     let tempSelectedSubFiles = this.state.selectedSubFiles;
    //     tempSelectedSubFiles[i] = {
    //         id: id,
    //         file: files
    //     };

    //     if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
    //         this.setState({
    //             selectedSubFiles: tempSelectedSubFiles
    //         })
    //     }

       

    //     let tempImgSrcSubs = this.state.imgSrcSubs;
    //     tempImgSrcSubs[i] = URL.createObjectURL(event.target.files[0]);

    //     this.setState({
    //         imgSrcSubs: tempImgSrcSubs
    //     })

    // }

    onClickHandler = () => {
        const data = new FormData();
        
        if (this.state.selectedFile) {
            for(var x = 0; x<this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }

            axios.post(`http://${config.IP_ADDRESS}:3001/upload-cat/${this.props.chosenCatInfo._id}`, data, { 
            // axios.post(`http://${config.IP_ADDRESS}:8000/upload-cat/${this.props.chosenCatInfo._id}`, data, { 
                // receive two parameter endpoint url ,form data 
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    })
                }
            })
            .then(res => { // then print response status
                // console.log(res.config.data.id);
                // console.log(res.statusText);
                console.log(res);
                toast.success('upload success')
                alert('File uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }

        

        // this.state.selectedSubFiles.forEach( subfile => {
        //     const subData = new FormData();

        //     if (subfile) {
        //         for(var x = 0; x<subfile.file.length; x++) {
        //             subData.append('file', subfile.file[x])
        //         }
            

        //         axios.post(`http://${config.IP_ADDRESS}:3001/upload-subcat/${subfile.id}`, subData, { 
        //             // receive two parameter endpoint url ,form data 
        //             onUploadProgress: ProgressEvent => {
        //                 this.setState({
        //                     loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
        //                 })
        //             }
        //         })
        //         .then(res => { // then print response status
        //             // console.log(res.config.data.id);
        //             // console.log(res.statusText);
        //             console.log(res);
        //             toast.success('upload success')
        //             alert('File uploaded successfully')
        //         })
        //         .catch(err => { 
        //             toast.error('upload fail')
        //         })

        //     }


        // } )






        this.setState({
            imgSrc : this.state.imgSrc + '?' + Math.random()
        });

        // not used
        this.handleTabIndex();

        this.props.history.push(`/admin/${this.props.index}`);




        
    }

    maxSelectFile=(event)=>{

        // console.log(event);

        let files = event.target.files // create file object
            if (files.length > 1) { 
               const msg = 'Only 1 image can be uploaded at a time'
               event.target.value = null // discard selected file
               console.log(msg)
              return false;
     
          }
        return true;
     
    }

    checkMimeType=(event)=>{
        //getting file object
        let files = event.target.files 
        //define message container
        let err = ''
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/gif']
        // loop access array
        for(var x = 0; x<files.length; x++) {
         // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err += files[x].type+' is not a supported format\n';
            }
        };

        for(var z = 0; z<err.length; z++) { // loop create toast massage
            event.target.value = null 
            toast.error(err[z])
        }
        return true;
    }

    checkFileSize=(event)=>{
        let files = event.target.files
        let size = 15000 
        let err = ""; 

        for(var x = 0; x<files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type+'is too large, please pick a smaller file\n';
            }
        };

        for(var z = 0; z<err.length; z++) {
            toast.error(err[z])
            event.target.value = null
        }
        return true;
   
    }    

    // ****************************************************


    handleCatInput = (event, field) => {

        let newFormdata = {
            ...this.state.formdata
        }

        if (field === 'cat_title') {
            newFormdata.cat.title = event.target.value;

        } else if (field === 'cat_description') {
            newFormdata.cat.description = event.target.value;
        } 

        this.setState({
            formdata: newFormdata
        })
    }


    handleHidden() {
        // console.log('switch switched')
        this.setState({
            formdata: {
                ...this.state.formdata,
                cat: {
                    ...this.state.formdata.cat,
                    catIsHidden: !this.state.formdata.cat.catIsHidden

                }
                
            }
            
        })
        console.log('cat is hidden: ' + this.state.formdata.cat.catIsHidden)
    }

    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }



    // handleSubCatInput(event, field, i) {
    //     // console.log(field, i);
    //     let newSubCatArray = this.state.formdata.allSubcats;

    //     switch(field) {
    //         case 'title':
    //             newSubCatArray[i].title = event.target.value;
    //             break;
    //         case 'description':
    //             newSubCatArray[i].description = event.target.value;
    //             break;
    //         default:
    //     }

    //     newSubCatArray[i].isModified = true;

    //     console.log(newSubCatArray);

    //     this.setState({
    //         formdata: {
    //             ...this.state.formdata,
    //             allSubcats: newSubCatArray
                
    //         }
    //     }) 
    // }





    removeCat = (e, id) => {
        this.props.dispatch(deleteCat(id));

        this.setState({
            catDeleted: true
        })

        setTimeout(() => {
            // this.props.history.push(`/user/edit-item-sel/${this.props.items.newitem.itemId}`);
            this.props.history.push(`/admin/0`);
        }, 2000)
    }


    // addField = () => {
    //     let newFormdata = {
    //         ...this.state.formdata,
    //         allSubcats: [
    //             ...this.state.formdata.allSubcats,
    //             {
    //                 title: '',
    //                 description: '',
    //                 parent_cat: this.props.chosenCatInfo._id,
    //                 isNew: true
    //             }
    //         ]
    //     }
    //     this.setState({
    //         formdata: newFormdata
    //     }) 

    // }



    // removeSubcat = (id) => {
    //     const tempAllSubcats = this.state.formdata.allSubcats;
    //     let removeIndex = this.state.formdata.allSubcats.map(subcat => subcat._id).indexOf(id);

    //     tempAllSubcats[removeIndex] = {
    //         ...tempAllSubcats[removeIndex],
    //         isDeleted: true
    //     }

    //     // (removeIndex >= 0) && tempAllSubcats.splice(removeIndex, 1);

    //     this.setState({
    //         formdata: {
    //             ...this.state.formdata,
    //             allSubcats: tempAllSubcats
    //         }
    //     })
    // }


    submitForm = (e) => {
        e.preventDefault();
        // console.log({...this.state.formdata.cat});
        console.log(this.state.formdata.cat);

        this.props.dispatch(updateCat(
                this.state.formdata.cat
            
        ))


        // // handle modified subcats
        // this.state.formdata.allSubcats.map( (subcat) =>{
        //     if (subcat.isModified) {
        //         // console.log(subcat)
        //         this.props.dispatch(updateSubcat(
        //             subcat
        //         ))
        //     }
        // })

        // // handle new subcats
        // this.state.formdata.allSubcats.map( (subcat) =>{
        //     if (subcat.isNew) {
        //         this.props.dispatch(addSubcat(
        //             subcat
        //         ))
        //     }
        // })

        // // handle deleted subcats
        // this.state.formdata.allSubcats.map( (subcat) =>{
        //     if (subcat.isDeleted) {
        //         this.props.dispatch(deleteSubcat(subcat._id))
        //     }
        // })

        this.onClickHandler();

        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/admin/${this.props.index}`);
        }, 2000)
        
    }

    cancel = () => {
        this.props.history.push(`/admin/0`)
    }



    render() {

        console.log(this.state.formdata.cat.catIsHidden)

        return (
            <div className="admin">
                { this.props.chosenCatInfo ? 
                    <div className="admin_cat_component">
                        <form onSubmit={this.submitForm}>
                            <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h3>Title</h3>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder={this.props.chosenCatInfo.title}
                                            defaultValue={this.props.chosenCatInfo.title} 
                                            onChange={(event) => this.handleCatInput(event, 'cat_title')}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <h3>Description</h3>
                                    </td>
                                    <td>
                                        <textarea
                                            type="text"
                                            placeholder="Enter category description"
                                            defaultValue={this.props.chosenCatInfo.description} 
                                            onChange={(event) => this.handleCatInput(event, 'cat', 'cat_description')}
                                            rows={6}
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <h3>Category Image</h3>
                                    </td>
                                    <td>
                                        <img className="change_cat_img" src={this.state.imgSrc} onError={this.addDefaultImg}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div className="form_element">
                                            <input type="file" className="admin_cat_img_input form-control" multiple name="file" accept="image/*" onChange={this.onImgChange}/>
                                            <br />
                                            {/* <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>  */}
                                        </div>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td></td>
                                    <td>
                                        <button 
                                            type="button" 
                                            className="btn btn-success btn-block delete" 
                                            onClick={(e) => { if (window.confirm('Are you sure you wish to delete this image?')) this.deleteImage() }}
                                        >
                                            Delete Image
                                        </button> 
                                    </td>
                                </tr>
                               

                                <tr>

                                    <td>
                                        <h3>Visibility</h3>
                                    </td>
                                    <td>
                                        <div className="admin_cat_visibility">
                                            <input 
                                                type="checkbox" 
                                                checked={this.state.formdata.cat.catIsHidden} 
                                                onChange={(event) => this.handleHidden(event)}
                                            />
                                            <span>Hide this category.</span>
                                        </div>
                                        
                                    </td>
                                </tr>


                                <tr>
                                    <td colSpan="2">
                                        <button type="button" 
                                            className="delete" 
                                            onClick={(e) => { if (window.confirm('Are you sure you wish to delete this category?')) this.removeCat(e, this.props.chosenCatInfo._id) } }
                                        >
                                            Delete Category
                                        </button>

                                    </td>
                                </tr>

                                <tr className="spacer"></tr>

                                <tr>
                                    <td>
                                        <button type="submit">Save Changes</button>
                                    </td>

                                    <td>
                                        <button type="button" onClick={this.cancel}>Cancel</button>
                                    </td>
                                    
                                </tr>

                                <tr className="spacer"></tr>


                            </tbody>
                            </table>
                            
                        </form>

                        

                        {this.state.catDeleted ?
                            <p className="message">Category deleted!</p>
                        : null}

                        {this.state.saved ?
                            <p className="message">All changes saved!</p>
                        : null}
                        
                    </div>
                : null }
            </div>
    
                

        )
    }
}

function mapStateToProps(state) {
    return {
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default withRouter(connect(mapStateToProps)(AdminCat));
