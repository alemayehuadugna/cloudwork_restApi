import { UpdateProfilePicture } from "@/freelancer/app/usecases/UpdateProfilePicture";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	updateProfilePicture: UpdateProfilePicture;
}

const uploadProfilePictureHandler = handler(({ updateProfilePicture }: Dependencies) =>
	async (req, res) => {
		let file = req.file;
		const idObject: any = req.auth.credentials.uid;
		const id: string = idObject.value;
		const profilePictureUrl = await updateProfilePicture({ file, id });

		res.status(HttpStatus.ACCEPTED).json({ data: profilePictureUrl });
	});

export { uploadProfilePictureHandler };