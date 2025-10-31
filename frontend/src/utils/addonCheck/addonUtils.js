export const checkStorage = (usedStorageKB, totalStorageGB) => {
    const totalStorageKB = totalStorageGB * 1024 * 1024;
    return usedStorageKB >= totalStorageKB;
  };
  
  export const checkDuration = (usedMilliseconds, totalHours) => {
    const totalMilliseconds = totalHours * 3600 * 1000;
    return usedMilliseconds >= totalMilliseconds;
  };