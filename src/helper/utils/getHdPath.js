function getHDPath(idx) {
    /**
     * HD_PATH TO CHECK
     * m/44'/1729'/${idx}'/0'
     * m/44'/1729'/0'/${idx}'
     */
    return `m/44'/1729'/${idx}'/0'`
}

module.exports = getHDPath