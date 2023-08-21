
import { roles } from './../../Middleware/auth.middleware.js';

export const endPoint = {
    create: [roles.User],
    createOrderWithAllItem:[roles.User],
    cancel:[roles.User,roles.Admin],
    updateStatusOrder:[roles.Admin],
    update: [roles.Admin],
    get: [roles.Admin, roles.User],
}