const Package = require('../models/Package')

async function seedPackages() {
    const packages = await Package.find({ })
    
    if (!packages.length) {
        const package_1 = new Package({
            name: 'Goat Pa-Iwi Program 2 (Meat) v2',
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
        await package_1.save()

        const package_2 = new Package({
            name: 'Goat Pa-Iwi Program 2 (Meat) v1',
            description: 'Pa-iwi duration: 35 months \nPackage cost: Php 160,000.00\nNo. Of heads: 15 heads upgraded goats',
            total_months: 35,
            payment: 160000,
            payouts: [
                {
                    month: 11,
                    amount: 180000,
                    description: 'After 11 months'
                },
                {
                    month: 19,
                    amount: 270000,
                    description: 'After 19 months'
                },
                {
                    month: 27,
                    amount: 270000,
                    description: 'After 27 months'
                },
                {
                    month: 35,
                    amount: 270000,
                    description: 'After 36 months'
                },
                {
                    month: 36,
                    amount: 300000,
                    description: 'After 35th Month - end of the contract'
                }
            ]
        })
        await package_2.save()
        
        console.log('Packages seeded')
        console.log(`Package 1: ${package_1._id}`)
        console.log(`Package 2: ${package_2._id}`)
        return
    } else {
        return
    }
}

module.exports = { seedPackages }
