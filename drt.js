var {JSDOM} = require('jsdom')
var request = require('request')

const url = 'http://drt.etribunals.gov.in/drtlive/caseenowisesearch.php'

exports.getDrtInfo = async function() {
    var page = await fetchPage(url)
    var document = getDocument(page)
    var drtBlocks = getDrtBlocks(document)
    var innerBlocks = getInnerBlocks(drtBlocks)
    var drt = getDrt(innerBlocks)
    return drt
}

exports.getCaseType = async function() {
    var page = await fetchPage(url)
    var document = getDocument(page)
    var caseType = getCaseType(document)
    return caseType
}

function fetchPage(url) {
    return new Promise((resolve, reject) => {
        request(url,(err,res,body) => {
            if(err) reject()
            resolve(body)
        })
    })
}

function getDocument(page) {
    var document = JSDOM.fragment(page)
    return document
}

function getDrtBlocks(document) {
    var drtBlocks = [].slice.call(document.getElementById('schemaname'))
    return drtBlocks
}

function getInnerBlocks(blocks) {
    var innerBlocks = blocks.map(option => getDrtKeyValue(option))
    return innerBlocks
}

function getDrtKeyValue(option) {
    var drt = option.textContent
    var value = option.value
    var key = value.substring(0,value.length-1).concat("-drt-").concat(value.substring(value.length-1))
    return {
        key,
        drt,
        value
    }
}

function getDrt(innerBlocks) {
    var drtKeyValue = innerBlocks.filter(data => data.drt.includes('DRT'))
    return JSON.stringify(drtKeyValue)
}

function getCaseType(document) {
    var caseTypeBlocks = [].slice.call(document.getElementById('case_type'))
    var caseType = caseTypeBlocks.map(option => getCaseKeyValue(option))
    return JSON.stringify(caseType)
}

function getCaseKeyValue(option) {
    var key = option.textContent.replace(/-/g,'')
    var value = key.split(' ').length===2 ? key.split(' ')[0][0].concat(key.split(' ')[1][0]) : key
    var remoteKey = option.value
    return {
        key,
        value,
        remoteKey
    }
}

