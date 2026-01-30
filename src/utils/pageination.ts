export const paginateFunctions = (page: number=1, limit: number=10) => {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum - 1;
    return { startIndex, endIndex };
};
