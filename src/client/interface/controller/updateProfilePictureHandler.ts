import { UpdateClientProfilePicture } from "@/client/app/usecase/UpdateProfilePicture"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";

type Dependencies = {
    updateClientProfilePicture: UpdateClientProfilePicture;
}

const updateProfilePictureHandler = handler(({updateClientProfilePicture}: Dependencies) => 
async (req, res) => {
    let file: Express.Multer.File | undefined = req.file;
    const idObject: any = req.auth.credentials.uid;
    const id: string = idObject.value;

    const profilePictureUrl = await updateClientProfilePicture({file, id});

    res.status(HttpStatus.ACCEPTED).json({data: profilePictureUrl});
}
);

export {updateProfilePictureHandler}