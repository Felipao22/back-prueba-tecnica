const { Router } = require('express');
const usuarioRoutes = require('./usuarioRoutes')
const facturaRoutes = require('./facturaRoutes')


const router = Router();

router.use('/user', usuarioRoutes)
router.use('/factura', facturaRoutes)




module.exports = router;
