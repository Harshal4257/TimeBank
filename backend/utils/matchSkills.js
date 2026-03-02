/**
 * Calculates a match score based on the intersection of skills.
 * This ensures that extra skills on a seeker's profile don't lower the score.
 */
const calculateMatchScore = (userSkills, jobSkills) => {
    // 1. Validation: If either side has no skills, it's a 0% match
    if (!userSkills || !jobSkills || !Array.isArray(userSkills) || !Array.isArray(jobSkills)) {
        return 0;
    }

    if (userSkills.length === 0 || jobSkills.length === 0) {
        return 0;
    }

    // 2. Normalize: Lowercase, trim, and remove empty strings or nulls
    const normalizedUser = userSkills
        .filter(s => s) // Remove null/undefined
        .map(s => String(s).toLowerCase().trim());
        
    const normalizedJob = jobSkills
        .filter(s => s) // Remove null/undefined
        .map(s => String(s).toLowerCase().trim());

    // 3. Count Matches (Intersection)
    // We want to see how many of the JOB'S required skills the USER has.
    const matches = normalizedJob.filter(skill => normalizedUser.includes(skill));

    // 4. Calculate Score
    // Formula: (Number of Matches) / (Total Skills the Job Demands)
    const score = matches.length / normalizedJob.length;

    // 5. Return as a decimal (e.g., 0.75 for 75%)
    return parseFloat(score.toFixed(2));
};

module.exports = calculateMatchScore;