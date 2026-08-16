const HEADER_MAX_LENGTH = 100;
const SCOPES = ['core', 'backend', 'frontend'];
const HEADER_PATTERN = new RegExp(`^\\[(${SCOPES.join('|')})\\]\\([^)]*\\) - .+$`);

module.exports = {
    plugins: [
        {
            rules: {
                'header-format': (parsed) => {
                    const header = parsed.header || '';
                    return [
                        HEADER_PATTERN.test(header),
                        `commit message must match "[<scope>](<domain>) - <message>", e.g. "[backend](auth) - fix login validation"`,
                    ];
                },
            },
        },
    ],
    rules: {
        'header-format': [2, 'always'],
        'header-max-length': [2, 'always', HEADER_MAX_LENGTH],
    },
};
