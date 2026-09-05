export const CONSULTATION_STATUS = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const CONSULTATION_STATUS_COLOR = {
  [CONSULTATION_STATUS.SCHEDULED]: "warning",
  [CONSULTATION_STATUS.IN_PROGRESS]: "primary",
  [CONSULTATION_STATUS.COMPLETED]: "success",
  [CONSULTATION_STATUS.CANCELLED]: "danger",
};

export const PRESCRIPTION_STATUS = {
  DRAFT: "Draft",
  GENERATED: "Generated",
};
