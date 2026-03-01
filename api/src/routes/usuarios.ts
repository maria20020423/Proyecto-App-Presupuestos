import {Router} from 'express';
import UserService from '../service/user.service.js';




export default (userService: UserService): Router => {


  const userRouter = Router();

  userRouter.get("/all",userService.getUsers);
  userRouter.get("/:id_usuario",userService.getUser); 
  userRouter.post("/create",userService.createUser);

  return userRouter;
};


