
import { UpdateEmployeeBasicProfile } from "@/employee/app/usecases/UpdateBasicProfile";
import { Employee } from "@/employee/domain/Employee";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
    updateEmployeeBasicProfile: UpdateEmployeeBasicProfile;
}

const {getBody} = makeValidator({
    // body: Joi.object({
    //     firstName: Joi.string().required(),
    //     lastName: Joi.string().required(),
    //     email: Joi.string().required()
    // }).required(),
});


const updateBasicProfileHandler = handler(
    ({updateEmployeeBasicProfile}: Dependencies) => 
    async (req: Request, res: Response) => {
        console.log("firstName: ", );
        let {firstName, lastName,email} = getBody(req);

        const idObject: any = req.auth.credentials.uid;
        const id: string = idObject.value;

        
        console.log(Employee);

        const employeeId = await updateEmployeeBasicProfile({
            firstName,
            lastName,
            email,
            id
        });
        
        console.log(employeeId);
        

        res.status(HttpStatus.OK).json({id: {employeeId}});
    }

)

export {updateBasicProfileHandler}