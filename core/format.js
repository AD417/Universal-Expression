function formatNumber(value, percision = 3, eMax = 5, eMin = -3,) {
    value = D(value)
    if (value.e > eMax || (value.e < eMin && eMin)) {
        let m = Math.floor(value.m * 10 ** percision) / (10 ** percision)
        if (m.toString().length === 1) m += ".000"
        else {
            m += "0000000"
            m = m.slice(0, percision + 2)
        }
        return m + "e" + value.e
    } else {
        return Math.floor(value.m * 10 ** value.e) 
    }
}

function display(value) {
    return formatNumber(value, 3, 5, 0)
}

function displayDecimal(value) {
    return formatNumber(value, 3, 0, -4)
}