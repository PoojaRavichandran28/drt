const drt = require('./drt')

async function execute() {
    const drtData = await drt.getDrtInfo()
    const caseType = await drt.getCaseType()
    console.log(drtData)
    console.log(caseType)
}

execute()