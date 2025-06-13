export const generateUniqueFileName = (fileExtension: string) => {
  return `attachment_${crypto.randomUUID()}.${fileExtension}`;
};
