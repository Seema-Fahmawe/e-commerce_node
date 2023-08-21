
import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CategoryRouter from './Category/Category.router.js';
import SubCategoryRouter from './SubCategory/SubCategory.router.js';
import BrandRouter from './Brand/Brand.router.js';
import couponRouter from './Coupon/Coupon.router.js';
import productRouter from './Product/Product.router.js';
import cartRouter from './Cart/Cart.router.js';
import orderRouter from './Order/Order.router.js';
import reviewRouter from './Review/Review.router.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullPath = path.join(__dirname, '../upload');

const initApp = (app, express) => {
    app.use(async (req, res, next) => {
        //  var whitelist = ['http://example1.com', 'http://example2.com']
        //  if (!whitelist.includes(req.header('origin'))) {
        //  return next(new Error('invalid origin', { cause: 403 }));
        //  }
        next();
    })

    app.use(cors());
    connectDB();
    app.use(express.json());
    app.use('/upload', express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/subCategory', SubCategoryRouter);
    app.use('/category', CategoryRouter);
    app.use('/brand', BrandRouter);
    app.use('/coupon', couponRouter);
    app.use('/product', productRouter);
    app.use('/cart', cartRouter);
    app.use('/order', orderRouter);
    app.use('/review', reviewRouter);
    app.use('/*', (req, res) => {
        return res.json({ messaga: "page not found" });
    })

    //global error handler
    app.use(globalErrorHandel)

}

export default initApp;