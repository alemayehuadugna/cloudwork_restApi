import { DeleteMilestone } from "@/milestone/app/useCases/RemoveMilestone";
import { handler } from "@/_lib/http/handler";

type Dependencies = {
    deleteMilestone: DeleteMilestone;
};

const deleteMilestoneHandler = handler(({ deleteMilestone }: Dependencies) => async (req, res) => {
    const { milestoneId } = req.params;

    await deleteMilestone(milestoneId);

    res.sendStatus(204);
});

export { deleteMilestoneHandler };