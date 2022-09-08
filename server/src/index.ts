import express from 'express';
import morgan from 'morgan';
import config from './config';
import router from './routers/_router';

const app = express();
const PORT = process.env.PORT || config.port;

app.use(express.json());
app.use(morgan('dev'));
app.use("/", router);

app.get('/', (_, res) => {
    res.send('Running server!');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});
