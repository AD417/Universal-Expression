function formatNumber(value, percision = 3, eMax = 5, eMin = -3,) {
    value = D(value)
    if (value.e > eMax || value.e < eMin) {
        return Math.floor(value.m * 10 ** percision) / (10 ** percision) + "e" + value.e
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