/**
 * Calculates Cosine Similarity between two arrays of skills.
 */
const calculateMatchScore = (userSkills, jobSkills) => {
    if (!userSkills || !jobSkills || userSkills.length === 0 || jobSkills.length === 0) return 0;

    // Create a unique set of all skills from both lists
    const allSkills = Array.from(new Set([...userSkills, ...jobSkills]));

    // Convert skill lists into binary vectors (1 if present, 0 if not)
    const userVec = allSkills.map(s => userSkills.includes(s) ? 1 : 0);
    const jobVec = allSkills.map(s => jobSkills.includes(s) ? 1 : 0);

    // Calculate Dot Product
    const dotProduct = userVec.reduce((sum, val, i) => sum + (val * jobVec[i]), 0);

    // Calculate Magnitudes
    const userMag = Math.sqrt(userVec.reduce((sum, val) => sum + (val * val), 0));
    const jobMag = Math.sqrt(jobVec.reduce((sum, val) => sum + (val * val), 0));

    // Final Cosine Similarity calculation
    if (userMag === 0 || jobMag === 0) return 0;
    return dotProduct / (userMag * jobMag);
};

module.exports = calculateMatchScore;