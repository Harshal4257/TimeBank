/**
 * Calculates Cosine Similarity between two arrays of skills.
 * Updated to handle case sensitivity and whitespace.
 */
const calculateMatchScore = (userSkills, jobSkills) => {
    if (!userSkills || !jobSkills || userSkills.length === 0 || jobSkills.length === 0) return 0;

    // 1. Normalize both arrays: Lowercase and remove extra spaces
    const normalizedUser = userSkills.map(s => s.toLowerCase().trim());
    const normalizedJob = jobSkills.map(s => s.toLowerCase().trim());

    // 2. Create a unique set of all skills from both normalized lists
    const allSkills = Array.from(new Set([...normalizedUser, ...normalizedJob]));

    // 3. Convert skill lists into binary vectors
    const userVec = allSkills.map(s => normalizedUser.includes(s) ? 1 : 0);
    const jobVec = allSkills.map(s => normalizedJob.includes(s) ? 1 : 0);

    // 4. Calculate Dot Product: $\sum_{i=1}^{n} A_i B_i$
    const dotProduct = userVec.reduce((sum, val, i) => sum + (val * jobVec[i]), 0);

    // 5. Calculate Magnitudes: $\sqrt{\sum_{i=1}^{n} A_i^2}$
    const userMag = Math.sqrt(userVec.reduce((sum, val) => sum + (val * val), 0));
    const jobMag = Math.sqrt(jobVec.reduce((sum, val) => sum + (val * val), 0));

    // 6. Final Cosine Similarity: $\frac{A \cdot B}{\|A\| \|B\|}$
    if (userMag === 0 || jobMag === 0) return 0;
    
    return dotProduct / (userMag * jobMag);
};

module.exports = calculateMatchScore;