import express from 'express';
import  { dirname } from 'path';
import  fs from 'fs'
import { fileURLToPath } from 'url';

const __fileUrl = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileUrl)



const app = express()


app.get('/video', ( req, res)=>{

    let filePath =  `${__dirname}/videos/video.mp4`;
    let fileState = fs.statSync(filePath);
    let fileSize = fileState.size;

    const range =  req.headers.range;
    if(range){
        
    let parts  = range.replace(/\D/g,"").split('-');
    let start = parseInt(parts[0],10);
    let end = parts[1] ? parseInt(parts[1], 10): fileSize-1;
    let chunck = 10**6;
    let stream = fs.createReadStream(filePath, {
        start,
        end
    })

    res.writeHead(206,{
        "content-length":chunck,
        "content-range":`bytes ${start}-${end}/${fileSize}`,
        "Content-Type":'video/mp4',
        "accept-ranges":'bytes'

    })
    stream.pipe(res);
} else {
    res.writeHead(206,{
        "content-length":fileSize,
        "Content-Type":'video/mp4',

    })
    fs.createReadStream(filePath).pipe(res)
}

})

app.listen(3000)
