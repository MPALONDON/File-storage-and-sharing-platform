import {useDropzone} from 'react-dropzone'
import {useState} from "react";

export default function UploadForm(){
    const token = localStorage.getItem("token")

    async function uploadVideo(event){
        event.preventDefault();
        const formData = new FormData(event.target);



        const response = await fetch(
                "http://127.0.0.1:8000/user/upload-file",{
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                  }, body: formData,
                });
                    const data = await response.json()
    }

    return(
            <div>
                <form onSubmit={(event)=>uploadVideo(event)} className="auth_Form" encType="multipart/form-data">
                    <label>Upload Video
                    <input name="file" type="file" />
                    </label>
                    <label>Video Title:
                        <input name="title" type="text" id="video-title"/>
                    </label>
                    <label>Video Description:
                        <input name="description" type="text" id="video-description"/>
                    </label>
                    <label>Upload Thumbnail
                    <input name="thumbnail" type="file"/>
                    </label>
                    <button type="submit">
                        Submit Video
                    </button>
                </form>

            </div>
    )
}