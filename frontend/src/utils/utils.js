/**
 * 
 * @param {string} currentStatus
 * @param {string[]} validStatuses 
 * @returns {string | null}
 */
export const getNextStatus = (currentStatus, validStatuses) => {
  const currentIndex = validStatuses.indexOf(currentStatus);
  
  if (currentIndex === -1) return null;

  return currentIndex < validStatuses.length - 1 
    ? validStatuses[currentIndex + 1] 
    : null;
};