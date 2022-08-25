const _serializeJob = (job: any) => {
  return {
    jobId: job.id.value,
    clientId: job.clientId,
    freelancerId: job.freelancerId,
    title: job.title,
    skills: job.skills,
    budget: job.budget,
    duration: job.duration,
    proposals: job.proposals,
    expiry: job.expiry,
    category: job.category,
    language: job.language,
    progress: job.progress,
    startDate: job.startDate,
    links: job.links,
    description: job.description,
    files: job.files,
    bid: job.bid,
    milestones: job.milestones,
    createdAt: job.createdAt
  };
};

const serializer = {
  _serializeJob(data) {
    if (!data) {
      throw new Error("Expect data to be not undefined nor null");
    }
    if (Array.isArray(data)) {
      return data.map(_serializeJob);
    }
    return _serializeJob(data);
  },
};

export { serializer };
