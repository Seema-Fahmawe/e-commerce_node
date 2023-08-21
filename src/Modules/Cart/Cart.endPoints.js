
import { roles } from './../../Middleware/auth.middleware.js';
export const endPoint = {
    create: [roles.User],
    update: [roles.User],
    deleteItem: [roles.User],
    clearCart: [roles.User],
    get: [roles.Admin, roles.User],
}