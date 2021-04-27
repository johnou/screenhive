import { Service, Inject } from "typedi";
import { User } from "../entities/User";
import argon2 from 'argon2'
import { RevokedToken } from "../entities/RevokedToken";


@Service()
export class UserService {
    private userRepo : Repository<User>;
    constructor(){
        this.userRepo = getRepository(User);
    }

    public getUsers(){
        return this.userRepo.find();
    }

    public getUser(fields: {username?: string, email?: string, id?: number}){
        return this.userRepo.findOneOrFail(fields);
    }

    public async createUser(email : string, username : string, password : string, dob: number){
            const newUser = this.userRepo.create();

            newUser.email = email;
            newUser.username = username;
            newUser.dob = new Date(dob);
            newUser.password = await argon2.hash(password);
            newUser.registered = new Date();
            newUser.lastLogin = new Date();
            await this.userRepo.save(newUser);
            return newUser;

    }

    public async saveUser(user: User){
        this.userRepo.save(user);
    }


}

