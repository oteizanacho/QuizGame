import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, '..', 'public')))
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index.html');
})

const expressServer = app.listen(port, () => {
    console.log('running on http://localhost:3000 ...')
})

export default expressServer;