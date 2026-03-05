import {useDropzone} from 'react-dropzone'
import {useState} from "react";

export default function UploadForm(){

    async function uploadVideo(event){
        event.preventDefault();
        const formData = new FormData(event.target);



        const response = await fetch(
                "http://localhost:8000/user/upload-file",{
                    method: "POST",
                    headers: {
                  },
                credentials : "include",
                body: formData,

                });
                if (response.ok) {
                    const data = await response.json()
                }else{
                    throw new Error(`HTTP ERROR! Status: ${response.status}`)
                }
    }

    return(
            <div className="upload-container">
                <div className="upload-background">
                <h1>Upload Videos</h1>
                <form onSubmit={(event)=>uploadVideo(event)} className="upload_Form" encType="multipart/form-data">
                    <label>Upload Video
                        <input name="file" type="file" multiple/>
                    </label>
                    <label>Video Title:
                        <input name="title" type="text" id="video-title"/>
                    </label>
                    <label>Video Description:
                        <input name="description" type="text" id="video-description"/>
                    </label>
                    <label>Upload Thumbnail
                        <input name="thumbnail" type="file" accept="image/*"/>

                    </label>

                    <button type="submit">
                        Submit Video
                    </button>
                </form>

            </div>
                </div>
    )
}