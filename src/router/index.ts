import express from 'express';

import cocktails from './cocktails';
import ingredients from './ingredients';

const router = express.Router();

export default (): express.Router => {
    cocktails(router);
    ingredients(router);

    return router;
};