module.exports = {
    default: {
        options: {
            thresholds: {
                'statements': 79,
                'branches': 60,
                'lines': 79,
                'functions': 70
            },
            dir: 'coverage/threshold',
            root: 'test'
        }
    }
};