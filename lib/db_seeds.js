const Package = require('../models/Package')

async function seedPackages() {
    const packages = await Package.find({ })
    
    if (!packages.length) {
        const new_package = new Package({
            name: 'Goat Pa-Iwi Program 2 (Meat)',
            description: 'Pa-iwi duration: 35 months \nPackage cost: Php 160,000.00\nNo. Of heads: 15 heads upgraded goats',
            total_months: 35,
            payment: 160000,
            payouts: [
                {
                    month: 11,
                    amount: 22500,
                    description: 'After 11 months'
                },
                {
                    month: 19,
                    amount: 45000,
                    description: 'After 19 months'
                },
                {
                    month: 27,
                    amount: 45000,
                    description: 'After 27 months'
                },
                {
                    month: 35,
                    amount: 45000,
                    description: 'After 36 months'
                },
                {
                    month: 36,
                    amount: 75000,
                    description: 'After 35th Month - end of the contract)'
                }
            ]
        })
        await new_package.save()
        console.log('Packages seeded')
        return
    } else {
        return
    }
}

module.exports = { seedPackages }
