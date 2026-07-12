module.exports = {
    'backend/**/*.js': (filenames) =>
        `eslint --fix --config backend/eslint.config.js ${filenames.map((f) => `"${f}"`).join(' ')}`,
    'frontend/**/*.{ts,html}': (filenames) =>
        `eslint --fix --config frontend/eslint.config.js ${filenames.map((f) => `"${f}"`).join(' ')}`,
};
