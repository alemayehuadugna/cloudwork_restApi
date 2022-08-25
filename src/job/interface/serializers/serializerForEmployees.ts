import { Job } from "@/job/domain/Job";

const _serializeJobForEmployee = (job: Job.Type) => {
    return {
        'jobId': job.id.value,
        'clientId': job.clientId,
        'freelancerId': job.freelancerId,
        'title': job.title,
        'skills': job.skills,
        'budget': job.budget,
        'duration': job.duration,
        'category': job.category,
        'proposals': job.proposals,
        'expiry': job.expiry,
        'language': job.language,
        'progress': job.progress,
        'bid': job.bid,
        'startDate': job.startDate, 
        'createdAt': job.createdAt
    }
}

const _serializeDetailedJobForEmployee = (job: Job.Type) => {
    return {
        'jobId': job.id.value,
        'clientId': job.clientId,
        'freelancerId': job.freelancerId,
        'title': job.title,
        'skills': job.skills,
        'budget': job.budget,
        'duration': job.duration,
        'proposals': job.proposals,
        'expiry': job.expiry,
        'category': job.category,
        'language': job.language,
        'progress': job.progress,
        'startDate': job.startDate,
        'links': job.links,
        'description': job.description,
        'files': job.files
    }
}

const serializeForEmployee = {
    serializeForEmployee(data) {
        if(!data) {
            throw new Error("Expect data to be not undefined nor null");
        }
        if(Array.isArray(data)) {
            return data.map(_serializeJobForEmployee);
        }
        return _serializeDetailedJobForEmployee(data);
    }
}

export { serializeForEmployee };